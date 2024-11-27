import { useEffect, useState } from "react";
import Hero from "./components/Hero";
import Searchbar from "./components/Searchbar";
import CardList from "./components/CardList";

type contactType = {
  id: number;
  name: string;
  number: string;
  email: string;
  address: string;
};

const App = () => {
  const [contacts, setContacts] = useState<contactType[]>([]);
  const [renderingContacts, setRenderingContacts] = useState<contactType[]>([]);
  const [search, setSearch] = useState("");
  useEffect(() => {
    fetch("http://localhost:8000/contacts")
      .then((response) => response.json())
      .then((data) => {
        setContacts(data);
        setRenderingContacts(data);
      })
      .catch((err) => console.error(err));

    console.log(renderingContacts);
  }, []);

  useEffect(() => {
    if (search.length === 0) setRenderingContacts(contacts);
    else {
      const filteredContacts = contacts.filter((contact: contactType) => {
        return (
          search.length > 0 &&
          (contact.name.toLowerCase().search(search.toLowerCase()) !== -1 ||
            contact.email.toLowerCase().search(search.toLowerCase()) !== -1 ||
            contact.number.startsWith(search) ||
            contact.address.toLowerCase().search(search.toLowerCase()) !== -1)
        );
      });
      setRenderingContacts(filteredContacts);
    }
    console.log(renderingContacts);
  }, [search]);

  return (
    <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 min-h-screen">
      <Hero />
      <Searchbar search={search} setSearch={setSearch} />
      <CardList contacts={renderingContacts} />
    </div>
  );
};

export default App;
