import TeacherApplicationForm from "@/components/TeacherApplicationForm";
import { useAuth } from "@/hooks/useAuth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const TeachersPage = () => {
  const { user, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-tma-deep-blue mx-auto mb-4"></div>
            <p className="text-tma-charcoal-grey">Loading...</p>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      {!user && (
        <Alert className="mb-6">
          <AlertTitle>Sign in required</AlertTitle>
          <AlertDescription>
            To protect applicants’ data, please sign in before submitting your application and CV.
          </AlertDescription>
          <div className="mt-3">
            <Link to={`/portal?next=${encodeURIComponent('/teachers')}`}>
              <Button size="sm">Sign in</Button>
            </Link>
          </div>
        </Alert>
      )}
      <TeacherApplicationForm />
    </div>
  );
};

export default TeachersPage;