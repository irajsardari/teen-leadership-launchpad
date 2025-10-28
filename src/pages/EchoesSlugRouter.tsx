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
import PeterSengePage from "./PeterSengePage";
import MichaelPorterPage from "./MichaelPorterPage";
import JimCollinsPage from "./JimCollinsPage";
import JohnKotterPage from "./JohnKotterPage";
import DanielKahnemanPage from "./DanielKahnemanPage";
import DanielGolemanPage from "./DanielGolemanPage";
import DaveUlrichPage from "./DaveUlrichPage";
import ViktorFranklPage from "./ViktorFranklPage";
import SteveJobsPage from "./SteveJobsPage";
import MuhammadYunusPage from "./MuhammadYunusPage";
import RobertKiyosakiPage from "./RobertKiyosakiPage";
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
    case "peter-senge":
      return <PeterSengePage />;
    case "michael-porter":
      return <MichaelPorterPage />;
    case "jim-collins":
      return <JimCollinsPage />;
    case "john-kotter":
      return <JohnKotterPage />;
    case "daniel-kahneman":
      return <DanielKahnemanPage />;
    case "daniel-goleman":
      return <DanielGolemanPage />;
    case "dave-ulrich":
      return <DaveUlrichPage />;
    case "viktor-frankl":
      return <ViktorFranklPage />;
    case "steve-jobs":
      return <SteveJobsPage />;
    case "muhammad-yunus":
      return <MuhammadYunusPage />;
    case "robert-kiyosaki":
      return <RobertKiyosakiPage />;
    default:
      return <NotFound />;
  }
};

export default EchoesSlugRouter;
