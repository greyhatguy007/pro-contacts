import Card from "./Card";

type contactType = {
  id: number;
  name: string;
  number: string;
  email: string;
  address: string;
};

type cardListPropType = {
    contacts : contactType[];
}

const CardList = (props: cardListPropType) => {
const contacts = props.contacts;
  return (
    <div className="flex justify-center p-3">
      <div className="bg-black bg-opacity-45 rounded-lg p-3 mt-5 flex flex-col gap-2 md:grid  md:auto-rows-frmd:max-w-[75rem] lg:max-w-[95rem] md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
        {contacts.map((contact) => {
          return <Card contact={contact} key={contact.id} />;
        })}
      </div>
    </div>
  );
}

export default CardList