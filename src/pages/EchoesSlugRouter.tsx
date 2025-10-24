import { useParams } from "react-router-dom";
import PeterDruckerPage from "./PeterDruckerPage";
import AbrahamMaslowPage from "./AbrahamMaslowPage";
import FrederickTaylorPage from "./FrederickTaylorPage";
import EltonMayoPage from "./EltonMayoPage";
import MaryParkerFollettPage from "./MaryParkerFollettPage";
import DouglasMcGregorPage from "./DouglasMcGregorPage";
import GeertHofstedePage from "./GeertHofstedePage";
import HenryMintzbergPage from "./HenryMintzbergPage";
import EdgarScheinPage from "./EdgarScheinPage";
import NotFound from "./NotFound";

const EchoesSlugRouter = () => {
  const { slug } = useParams();

  switch (slug) {
    case "peter-drucker":
      return <PeterDruckerPage />;
    case "abraham-maslow":
      return <AbrahamMaslowPage />;
    case "frederick-taylor":
      return <FrederickTaylorPage />;
    case "elton-mayo":
      return <EltonMayoPage />;
    case "mary-parker-follett":
      return <MaryParkerFollettPage />;
    case "douglas-mcgregor":
      return <DouglasMcGregorPage />;
    case "geert-hofstede":
      return <GeertHofstedePage />;
    case "henry-mintzberg":
      return <HenryMintzbergPage />;
    case "edgar-schein":
      return <EdgarScheinPage />;
    default:
      return <NotFound />;
  }
};

export default EchoesSlugRouter;
