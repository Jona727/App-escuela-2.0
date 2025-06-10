
type Props = {
    description?: string
    price?: number
    type?: string
}

function CardDetail({description, price, type}: 
  Props) {
  return(
    <>
     <p className={`card-text ${type=="producto" ? "text-success" : "text-primary"} `}>
      {description}</p>
          <h6 className={`card-subtitle`} mb-2 text-muted>Precio: ${price}
          </h6>
        <a href="#" className="btn btn-primary">Comprar</a>
    </>
  );
}

export default CardDetail
