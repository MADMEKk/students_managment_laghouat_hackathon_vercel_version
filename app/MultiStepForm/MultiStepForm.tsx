import { useState } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  country: string;
  city: string;
  education: string;
  experience: string;
  photo: File | null;
}

const MultiStepForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    country: '',
    city: '',
    education: '',
    experience: '',
    photo: null,
  });

  const steps = [
    { id: 1, name: 'Personal Information' },
    { id: 2, name: 'Education' },
    { id: 3, name: 'Work Experience' },
    { id: 4, name: 'User Photo' },
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    console.log('Form Data:', {
      personalInfo: {
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        email: formData.email,
        country: formData.country,
        city: formData.city,
      },
      education: formData.education,
      workExperience: formData.experience,
      photo: formData.photo ? formData.photo.name : null,
    });
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-gray-500 mb-4">Enter your personal information to get closer to companies.</div>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleInputChange}
                className="p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleInputChange}
                className="p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone number"
                value={formData.phone}
                onChange={handleInputChange}
                className="p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="email"
                name="email"
                placeholder="E-mail Address"
                value={formData.email}
                onChange={handleInputChange}
                className="p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="p-2 border rounded-md w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Country</option>
                <option value="US">United States</option>
                <option value="UK">United Kingdom</option>
                <option value="CA">Canada</option>
              </select>
              <select
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="p-2 border rounded-md w-full bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select City</option>
                <option value="NY">New York</option>
                <option value="LA">Los Angeles</option>
                <option value="CH">Chicago</option>
              </select>
            </div>
          </div>
        );
      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Education</h2>
            <textarea
              name="education"
              placeholder="Enter your education details"
              value={formData.education}
              onChange={(e) => setFormData(prev => ({ ...prev, education: e.target.value }))}
              className="p-2 border rounded-md w-full h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">Work Experience</h2>
            <textarea
              name="experience"
              placeholder="Enter your work experience"
              value={formData.experience}
              onChange={(e) => setFormData(prev => ({ ...prev, experience: e.target.value }))}
              className="p-2 border rounded-md w-full h-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold mb-4">User Photo</h2>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFormData(prev => ({ ...prev, photo: e.target.files?.[0] || null }))}
              className="p-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl mx-auto">
      {/* Left sidebar with steps */}
      <div className="w-64 bg-[#2D2D3F] text-white p-8">
        <div className="text-xl font-bold mb-8">indeed</div>
        <div className="space-y-6">
          <div className="text-lg font-medium mb-4">Step {currentStep}</div>
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-center relative">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center
                ${currentStep === step.id ? 'bg-blue-500' : 'bg-gray-600'}
                ${currentStep > step.id ? 'bg-green-500' : ''}
              `}>
                {step.id}
              </div>
              <span className={`ml-4 text-sm ${currentStep === step.id ? 'text-white' : 'text-gray-400'}`}>
                {step.name}
              </span>
              {index < steps.length - 1 && (
                <div className={`absolute left-4 top-8 w-0.5 h-12 -ml-0.5
                  ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-600'}`} 
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 p-8">
        <h2 className="text-2xl font-semibold mb-6">Your Personal Information</h2>
        <form>
          {renderStep()}
          <div className="mt-8 flex justify-between">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={handlePrevious}
                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Previous
              </button>
            )}
            <button
              type="button"
              onClick={currentStep === steps.length ? handleSubmit : handleNext}
              className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {currentStep === steps.length ? 'Submit' : 'Next Step'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MultiStepForm;
