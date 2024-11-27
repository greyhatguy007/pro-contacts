import { useState } from "react";

type contactType = {
  id: number;
  name: string;
  number: string;
  email: string;
  address: string;
};

type EditContactProps = {
  contact: contactType;
  onCancel: () => void;
};

export const EditContact = ({ contact, onCancel }: EditContactProps) => {
  const [name, setName] = useState(contact.name);
  const [number, setNumber] = useState(contact.number);
  const [email, setEmail] = useState(contact.email);
  const [address, setAddress] = useState(contact.address);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (name.length === 0) {
      alert("Name cannot be empty");
      return;
    }
    if (number.length === 0) {
      alert("Number cannot be empty");
      return;
    }
    if (number.length != 10) {
      alert("Invalid Number");
      return;
    }
    if (email.length > 0 && email.search("@") === -1) {
      alert("Invalid Email");
      return;
    }
    const content = JSON.stringify({
      name: name,
      number: number,
      email: email,
      address: address,
    });
    const response = await fetch(
      `http://localhost:8000/contacts/${contact.id}`,
      {
        method: "PUT",
        body: content,
      }
    );
    const data = await response.text();
    console.log(data);
    alert("Contact edited successfully!");
    window.location.reload();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center gap-2 m-2 rounded-lg w-[90vw] bg-slate-300 p-4 text-black md:w-80 md:place-items-stretch lg:text-lg md:h-auto"
    >
      <div className="flex flex-col items-stretch ">
        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="input input-bordered bg-slate-400"
        />
      </div>
      <div className="flex flex-col items-stretch ">
        <label>Number</label>
        <input
          type="text"
          value={number}
          onChange={(e) => setNumber(e.target.value)}
          className="input input-bordered bg-slate-400"
        />
      </div>
      <div className="flex flex-col items-stretch ">
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input input-bordered bg-slate-400"
        />
      </div>
      <div className="flex flex-col items-stretch ">
        <label>Address:</label>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="input input-bordered bg-slate-400"
        />
      </div>
      <div className="flex justify-end space-x-4 mt-4">
        <button type="button" onClick={onCancel} className="btn btn-secondary">
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-primary"
          onClick={(e) => handleSubmit(e)}
        >
          Save
        </button>
      </div>
    </form>
  );
};
