import { useState } from "react";
import { useMediaQuery } from "react-responsive";
import { EditContact } from "./EditContact";

type contactType = {
  id: number;
  name: string;
  number: string;
  email: string;
  address: string;
};

type cardPropType = {
  contact: contactType;
};

const Card = (props: cardPropType) => {
  const [expanded, setExpanded] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const isMdScreen = useMediaQuery({ query: "(min-width: 768px)" });
  const contact = props.contact;

  async function deleteContact(id: number) {
    const response = await fetch(`http://localhost:8000/contacts/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error("Failed to delete contact");
    }
    alert("Contact deleted successfully!");
    window.location.reload();
  }

  return isEditing ? (
    <EditContact contact={contact} onCancel={() => setIsEditing(false)} />
  ) : (
    <div className="flex flex-row items-center m-2 rounded-lg w-[90vw] bg-slate-300 p-4 text-black md:w-80 md:place-items-stretch lg:text-lg md:h-auto">
      <div className="flex flex-col justify-between">
        <div className="flex justify-between w-[90vw] md:w-80">
          <p className="mx-3 font-semibold  text-lg lg:text-2xl my-auto">
            {contact.name}
          </p>
          <div className="mx-5">
            <div className="mx-3 text-lg lg:text-xl text-center">
              {contact.number}
            </div>
            <div
              className="text-xs text-center text-blue-600 md:hidden my-2"
              onClick={() => !isMdScreen && setExpanded(!expanded)}
            >
              show {expanded ? " less" : " more"}
            </div>
          </div>
        </div>

        <div>
          {(expanded || isMdScreen) && (
            <div className="flex flex-col">
              <div className="mx-3 my-2">{contact.email}</div>
              <div className="mx-3 font-bold text-sm lg:text-lg">Address</div>
              <div className="px-5">{contact.address}</div>
              <div className="flex justify-evenly my-4">
                <button
                  className="btn btn-success"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-error"
                  onClick={() => deleteContact(contact.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
