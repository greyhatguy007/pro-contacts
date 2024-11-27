package main

import (
	"database/sql"
	"encoding/json"
	"log"
	"net/http"
	"os"
	"github.com/gorilla/mux"
	_ "github.com/lib/pq"
)

type Contact struct{
	ID int 	`json:"id"`
	Name string `json:"name"`
	Number string `json:"number"`
	Email string `json:"email"`
	Address string `json:"address"`
}

func main(){
	db, err := sql.Open("postgres", os.Getenv("DATABASE_URL"))
	if err!=nil{
		log.Fatal(err)
	}
	defer db.Close()

	_, err = db.Exec("CREATE TABLE IF NOT EXISTS contacts (id SERIAL PRIMARY KEY, name TEXT, number TEXT, email TEXT, address TEXT)")

	if err!=nil{
		log.Fatal(err)
	}

	router := mux.NewRouter()
	router.HandleFunc("/contacts", getContacts(db)).Methods("GET")
	router.HandleFunc("/contacts/{id}", getContact(db)).Methods("GET")
	router.HandleFunc("/contacts", createContact(db)).Methods("POST")
	router.HandleFunc("/contacts/{id}", updateContact(db)).Methods("PUT")
	router.HandleFunc("/contacts/{id}", deleteContact(db)).Methods("DELETE")

	log.Fatal(http.ListenAndServe(":8000", jsonContentTypeMiddleware(router)))
}

func jsonContentTypeMiddleware(handler http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		w.Header().Set("Content-Type","application/json")
		if r.Method == http.MethodOptions {
            w.WriteHeader(http.StatusOK)
            return
        }
		handler.ServeHTTP(w,r)
	})
}

func getContacts(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		rows, err := db.Query("SELECT * FROM contacts")
		if err!=nil{
			w.WriteHeader(http.StatusNotFound)
			return
		}
		defer rows.Close()
		contacts := []Contact{}
		for rows.Next(){
			var c Contact
			if err:=rows.Scan(&c.ID, &c.Name, &c.Number, &c.Email, &c.Address); err!=nil{
				log.Fatal(err)
			}
			contacts = append(contacts, c)
		}
		if err:=rows.Err(); err!=nil {
			w.WriteHeader(http.StatusNotFound)
			return
		}
		json.NewEncoder(w).Encode(contacts)
	}
}

func getContact(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id := vars["id"]
		var c Contact
		err := db.QueryRow("SELECT * FROM contacts WHERE id = $1", id).Scan(&c.ID, &c.Name, &c.Number, &c.Email, &c.Address)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		}
		json.NewEncoder(w).Encode(c)
	}
}

func createContact(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var c Contact
		json.NewDecoder(r.Body).Decode(&c)

		err := db.QueryRow("INSERT INTO contacts (name, number, email, address) VALUES ($1, $2, $3, $4) RETURNING id", c.Name, c.Number, c.Email, c.Address).Scan(&c.ID)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		json.NewEncoder(w).Encode(c)
	}
}

func updateContact(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var c Contact
		json.NewDecoder(r.Body).Decode(&c)
		vars := mux.Vars(r)
		id := vars["id"]
		_, err := db.Exec("UPDATE contacts SET name = $1, number = $2, email = $3, address = $4 WHERE id = $5", c.Name, c.Number, c.Email, c.Address, id)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		json.NewEncoder(w).Encode(c)
	}
}

func deleteContact(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		vars := mux.Vars(r)
		id := vars["id"]
		var c Contact
		err := db.QueryRow("SELECT * FROM contacts WHERE id = $1", id).Scan(&c.ID, &c.Name, &c.Number, &c.Email, &c.Address)
		if err != nil {
			w.WriteHeader(http.StatusNotFound)
			return
		} else {
			_, err := db.Exec("DELETE FROM contacts WHERE id = $1", id)
			if err != nil {
				//todo : fix error handling
				w.WriteHeader(http.StatusNotFound)
				return
			}
			json.NewEncoder(w).Encode("User deleted")
		}
	}
}