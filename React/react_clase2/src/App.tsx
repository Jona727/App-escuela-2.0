import CardPosta from "../src/components/CardPosta";


function App() {
  //logica de Componente
  const name = "Notebook Pro 16";
  const l = "https://f.fcdn.app/imgs/db7d07/www.zonatecno.com.uy/zoteuy/0c7c/webp/catalogo/106690_106690_1/800x800/notebook-lenovo-yoga-pro-7-ryzen-9-365-1tb-32gb-14-5-gray-notebook-lenovo-yoga-pro-7-ryzen-9-365-1tb-32gb-14-5-gray.jpg";
  const desc = "ggsdagsagsdgsagsa";
  const pre = 1.500;
  const type = "producto";

  //Marado del Componente
  return <CardPosta title={name}
    imgLink={l}
    description={desc}
    price={pre}
    type = {type}
    />;
  
}

export default App;
