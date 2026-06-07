import { Link, useSearchParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const ThankYouPage = () => {
  const [params] = useSearchParams();
  const already = params.get("already") === "1";
  return (
    <>
      <Helmet><title>Application received · Trade Finance Academy</title></Helmet>
      <div className="container mx-auto px-4 py-20 max-w-xl text-center">
        <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-6" />
        <h1 className="text-3xl font-bold mb-3">
          {already ? "You have already applied" : "Application received"}
        </h1>
        <p className="text-muted-foreground mb-3">
          {already
            ? "We already have an application on file for this email. Please do not submit again."
            : "Thank you for applying to the Trade Finance Academy. Your application has been received."}
        </p>
        <p className="text-muted-foreground mb-8">
          Our team will review your application and contact you by email within a few business days.
          If you need help in the meantime, please get in touch.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Button asChild>
            <Link to="/">Back to home</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/contact">Contact us</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/portal">Go to learning portal</Link>
          </Button>
        </div>
      </div>
    </>
  );
};

export default ThankYouPage;