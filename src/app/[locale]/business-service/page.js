"use client";
import { Poppins } from "next/font/google";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useTranslation } from "@/lib/translations";
import { useRouter } from "next/navigation";
import Navbar from "@/app/components/Navbar";

const PoppinsFont = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
});

const ServiceManagement = () => {
  const router = useRouter();
  const { locale } = useParams();
  const t = useTranslation(locale || "ar");

  // Service Management State
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [services, setServices] = useState([]);
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Working Hours State
  const [workingHours, setWorkingHours] = useState({
    [t("monday")]: { start: "09:00", end: "17:00", active: true },
    [t("tuesday")]: { start: "09:00", end: "17:00", active: true },
    [t("wednesday")]: { start: "09:00", end: "17:00", active: true },
    [t("thursday")]: { start: "09:00", end: "17:00", active: true },
    [t("friday")]: { start: "09:00", end: "17:00", active: true },
    [t("saturday")]: { start: "09:00", end: "17:00", active: false },
    [t("sunday")]: { start: "09:00", end: "17:00", active: false },
  });

  const [selectedTone, setSelectedTone] = useState(t("friendlyOption"));

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [addServiceSuccess, setAddServiceSuccess] = useState(false);

  const handleServiceSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!serviceName.trim()) {
      setSubmitError(t("Please Fill out the required Fields"));
      return;
    }

    const convertWorkingHours = (hoursObj) => {
      const converted = {};
      for (const day in hoursObj) {
        converted[day.toLowerCase()] = hoursObj[day];
      }
      return converted;
    };

    const newService = {
      serviceName,
      description,
      isActive,
      id: Date.now(),
      working_hours: convertWorkingHours(workingHours),
    };

    try {
      setIsSubmitting(true);
      setSubmitError("");
      setAddServiceSuccess(false);

      const token = localStorage.getItem("access_token");
      const response = await fetch(
        "https://api.neurovisesolutions.com/business-service",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            services: [newService],
            working_hours: {},
            chat_tone: selectedTone,
          }),
        }
      );

      if (!response.ok) throw new Error(t("error.saveFailed"));

      const result = await response.json();
      setAddServiceSuccess(true);
      setServices([...services, newService]);

      // Reset fields
      setServiceName("");
      setDescription("");
      setIsActive(true);
      setTimeout(() => setAddServiceSuccess(false), 3000);
    } catch (error) {
      setSubmitError(error.message || t("error.saveFailed"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Working Hours Handlers
  const toggleDayActive = (day) => {
    setWorkingHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], active: !prev[day].active },
    }));
  };

  const handleTimeChange = (day, field, value) => {
    setWorkingHours((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }));
  };

  const handleSubmitAll = () => {
    // Since we're saving each service immediately, this can just redirect
    router.push(`/${locale}`);
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push(`/${locale}/login`);
    } else {
      setIsAuthChecked(true);
    }
  }, []);

  if (isAuthChecked) {
    return (
      <>
        <div
          className={`min-h-screen bg-cover bg-center bg-no-repeat relative ${PoppinsFont.variable} font-sans text-white`}
          style={{ backgroundImage: "url('/images/newimg.jpg')" }}
        >
          {/* Black overlay with 20% opacity */}
          <div className="absolute inset-0 bg-gray-600/90 "></div>
          
          {/* Content wrapper with relative positioning */}
          <div className="relative z-10 min-h-screen">
            <Navbar />

            <div className="container mx-auto px-4 py-8">
              <div className="max-w-5xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10">
                  <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {t("serviceManagement")}
                  </h1>
                  <div className="h-1 w-20 bg-gradient-to-r from-teal-400 to-emerald-500 mx-auto rounded-full"></div>
                </div>

                {/* Main Content */}
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl overflow-hidden shadow-xl border border-white/10">
                  {/* Status Messages */}
                  {submitError && (
                    <div className="mx-6 mt-6 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                      <p className="text-sm text-red-200 font-medium">{submitError}</p>
                    </div>
                  )}
                  {(submitSuccess || addServiceSuccess) && (
                    <div className="mx-6 mt-6 p-3 bg-green-500/20 border border-green-500/50 rounded-lg">
                      <p className="text-sm text-green-200 font-medium">
                        {t("Service Setting Added Succesfully")}
                      </p>
                    </div>
                  )}

                  <div className="p-6 lg:p-8 bg-white text-black ">
                    {/* Service Form */}
                    <div className="mb-10">
                      <h2 className="text-xl font-semibold text-black mb-6 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 flex items-center justify-center mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                        </div>
                        {t("ServiceDetails")}
                      </h2>

                      <form onSubmit={handleServiceSubmit} className="space-y-6">
                        <div className="space-y-4">
                          <div>
                            <label
                              htmlFor="serviceName"
                              className="block text-sm font-medium text-gray-800 mb-1"
                            >
                              {t("serviceName")}*
                            </label>
                            <input
                              type="text"
                              id="serviceName"
                              placeholder={t("acService")}
                              value={serviceName}
                              onChange={(e) => setServiceName(e.target.value)}
                              required
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-black transition-all duration-200"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="description"
                              className="block text-sm font-medium text-gray-800 mb-1"
                            >
                              {t("description")} {t("optional")}
                            </label>
                            <textarea
                              id="description"
                              placeholder={t("serviceNeed")}
                              value={description}
                              onChange={(e) => setDescription(e.target.value)}
                              rows={3}
                              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400 text-black transition-all duration-200"
                            />
                            <p className="text-xs text-gray-800 mt-1">
                              {description.length} {t("characters")}
                            </p>
                          </div>

                          <div className="flex items-center">
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={isActive}
                                onChange={() => setIsActive(!isActive)}
                                className="sr-only peer"
                              />
                              <div className="w-11 h-6 bg-white/10 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-teal-500"></div>
                              <span className="ml-3 text-sm font-medium text-gray-800">
                                {t("enableService")}
                              </span>
                            </label>
                          </div>
                        </div>
                      </form>
                    </div>

                    {/* Working Hours */}
                    <div className="mb-10">
                      <h2 className="text-xl font-semibold text-black mb-6 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 flex items-center justify-center mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        {t("workingHours")}
                      </h2>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.keys(workingHours).map((day) => (
                          <div 
                            key={day}
                            className={`p-4 rounded-lg transition-all duration-200 ${
                              workingHours[day].active 
                                ? "bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30" 
                                : "bg-white/5 border border-white/10"
                            }`}
                          >
                            <div className="flex justify-between items-center mb-2">
                              <span className="font-medium text-black">{day}</span>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={workingHours[day].active}
                                  onChange={() => toggleDayActive(day)}
                                  className="sr-only peer"
                                />
                                <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500"></div>
                              </label>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs text-gray-600 mb-1">
                                  {t("startTime")}
                                </label>
                                <select
                                  value={workingHours[day].start}
                                  onChange={(e) =>
                                    handleTimeChange(day, "start", e.target.value)
                                  }
                                  disabled={!workingHours[day].active}
                                  className={`w-full px-2 py-1.5 rounded-md text-sm ${
                                    workingHours[day].active
                                      ? "bg-white/10 border border-white/20 text-gray-700"
                                      : "bg-white/5 border border-white/10 text-gray-700"
                                  }`}
                                >
                                  {Array.from({ length: 24 * 2 }, (_, i) => {
                                    const hour = Math.floor(i / 2)
                                      .toString()
                                      .padStart(2, "0");
                                    const minute = i % 2 === 0 ? "00" : "30";
                                    const time = `${hour}:${minute}`;
                                    return (
                                      <option className="text-black"  key={time} value={time}>
                                        {time}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                              <div>
                                <label className="block text-xs text-gray-800 mb-1">
                                  {t("endTime")}
                                </label>
                                <select
                                  value={workingHours[day].end}
                                  onChange={(e) =>
                                    handleTimeChange(day, "end", e.target.value)
                                  }
                                  disabled={!workingHours[day].active}
                                  className={`w-full px-2 py-1.5 rounded-md text-sm ${
                                    workingHours[day].active
                                      ? "bg-white/10 border border-white/20 text-gray-700"
                                      : "bg-white/5 border border-white/10 text-gray-700"
                                  }`}
                                >
                                  {Array.from({ length: 24 * 2 }, (_, i) => {
                                    const hour = Math.floor(i / 2)
                                      .toString()
                                      .padStart(2, "0");
                                    const minute = i % 2 === 0 ? "00" : "30";
                                    const time = `${hour}:${minute}`;
                                    return (
                                      <option className="text-black" key={time} value={time}>
                                        {time}
                                      </option>
                                    );
                                  })}
                                </select>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Chat Communication Style */}
                    <div className="mb-10">
                      <h2 className="text-xl font-semibold text-black mb-6 flex items-center">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-teal-500 to-emerald-600 flex items-center justify-center mr-2">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                        </div>
                        {t("chatCommunicationStyle")}
                      </h2>

                      <div className="space-y-4">
                        <div 
                          className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedTone === t("friendlyOption")
                                ? "bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-500/30"
                              : "bg-white/5 border border-white/10 hover:bg-white/10"
                          }`}
                          onClick={() => setSelectedTone(t("friendlyOption"))}
                        >
                          <div className="flex-shrink-0">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              selectedTone === t("friendlyOption")
                                ? "bg-teal-500"
                                : "border-2 border-white/40"
                            }`}>
                              {selectedTone === t("friendlyOption") && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-medium text-black">{t("friendlyOption")}</h3>
                            <p className="text-sm text-gray-800">{t("warmTone")}</p>
                          </div>
                        </div>

                        <div 
                          className={`flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                            selectedTone === t("formalOption")
                              ? "bg-gradient-to-r from-teal-500/20 to-emerald-500/20 border border-teal-500/30"
                              : "bg-white/5 border border-white/10 hover:bg-white/10"
                          }`}
                          onClick={() => setSelectedTone(t("formalOption"))}
                        >
                          <div className="flex-shrink-0">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                              selectedTone === t("formalOption")
                                ? "bg-teal-500"
                                : "border-2 border-white/40"
                            }`}>
                              {selectedTone === t("formalOption") && (
                                <div className="w-2 h-2 bg-white rounded-full"></div>
                              )}
                            </div>
                          </div>
                          <div>
                            <h3 className="font-medium text-black">{t("formalOption")}</h3>
                            <p className="text-sm text-gray-700">{t("professionalTone")}</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-4 justify-end">
                      <button
                        onClick={handleSubmitAll}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-green-500/20 transform transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 focus:ring-offset-gray-900"
                      >
                        {t("done")}
                      </button>
                      <button
                        onClick={handleServiceSubmit}
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-gradient-to-r from-teal-500 to-emerald-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-teal-500/20 transform transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                      >
                        {isSubmitting ? (
                          <div className="flex items-center">
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {t("saving")}
                          </div>
                        ) : (
                          t("addService")
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
};

export default ServiceManagement;