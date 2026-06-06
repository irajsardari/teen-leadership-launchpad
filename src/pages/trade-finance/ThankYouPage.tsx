import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

const ThankYouPage = () => (
  <>
    <Helmet><title>Application received · Trade Finance Academy</title></Helmet>
    <div className="container mx-auto px-4 py-20 max-w-xl text-center">
      <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-3">Application received</h1>
      <p className="text-muted-foreground mb-8">
        Thank you for applying to the Trade Finance Academy. Our team will review your application and contact you by email within a few business days.
      </p>
      <Button asChild variant="outline">
        <Link to="/trade-finance">Back to program</Link>
      </Button>
    </div>
  </>
);

export default ThankYouPage;