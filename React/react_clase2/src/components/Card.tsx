//nombre de Producto
//Link a la foto
//Descricpion del Producto

interface CardProps {
    nombre?: string;
    link: string;
    descripcion: string;
    precio: number;
}


function Card({nombre, link, descripcion, precio}: CardProps)
{
    //Logica del componente

    
    //Marcado del componente
    return (
        <><div>Este es el card de: {nombre?
        nombre:"sin nombre!"}</div>
        <div>La foto el Producto es: <img width={"200px"} src={link}></img></div>
        <div>Descripcion: {descripcion} </div>
        <div>Precio: ${precio} </div>
        </>
    )
}

export default Card;