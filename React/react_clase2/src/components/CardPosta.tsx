import CardDetail from "./CardDetail";

type Props = {
  title: string
  imgLink: string
  description: string
  price: number
  type: string
};

function CardPosta({ title, imgLink, description, price, type }: Props) {
  const cardStyle = {
    width: "18rem",
    margin: "1rem",
  };

  return (
    <div>
     <div className="card" style={cardStyle}>
      <img src={imgLink} className="card-img-top" alt="..." />
      <div className="card-body">
        <h5 className="card-title">{title}</h5>
      </div>
      <CardDetail description={description}
      price={price} type={type} />
     </div>
    </div>
  );
}


export default CardPosta;