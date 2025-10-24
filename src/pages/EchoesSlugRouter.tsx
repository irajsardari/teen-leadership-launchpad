import { useParams } from "react-router-dom";
import PeterDruckerPage from "./PeterDruckerPage";
import AbrahamMaslowPage from "./AbrahamMaslowPage";
import FrederickTaylorPage from "./FrederickTaylorPage";
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
    default:
      return <NotFound />;
  }
};

export default EchoesSlugRouter;
