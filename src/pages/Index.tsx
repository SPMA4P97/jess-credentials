
import CredentialGenerator from "@/components/CredentialGenerator";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Digital Credential Generator
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Create professional digital credentials for academic journals, peer reviews, and educational achievements
          </p>
        </div>
        <CredentialGenerator />
      </div>
    </div>
  );
};

export default Index;
