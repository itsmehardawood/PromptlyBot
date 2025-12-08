"use client";

import { useEffect, useState } from "react";
import { IoEyeSharp } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { BsToggle2Off } from "react-icons/bs";
import { BsToggle2On } from "react-icons/bs";
import ChatHistory from "@/app/components/chathistory";
import BackButton from "@/app/components/BackButton";
import { useRouter, useParams } from "next/navigation";
import { FiPlus } from "react-icons/fi";               // Plus icon
import { MdOutlineMiscellaneousServices } from "react-icons/md"; // Service icon


export default function ServicesAdminPage() {
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [services, setServices] = useState([]);
  const [chatTone, setChatTone] = useState("");
  const [selectedDescription, setSelectedDescription] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Set initial loading state to true
  const [isLoadingService, setIsLoadingService] = useState(false); // Separate loading state for service details
  const [isEditMode, setIsEditMode] = useState(false);
  const [showAllServices, setShowAllServices] = useState(false); // New state for show more functionality
  const [editForm, setEditForm] = useState({
    serviceName: "",
    description: "",
    working_hours: {},
  });
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    action: null, // 'delete', 'toggle', 'edit'
    payload: null,
  });

  const router = useRouter();
  const { locale } = useParams();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      router.push(`/${locale}/login`);
    } else {
      setIsAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true); // Set loading to true when fetching starts
      try {
        const token = localStorage.getItem("access_token");

        const response = await fetch(
          "https://api.neurovisesolutions.com/business-service",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          router.push(`/${locale}/login`);
          return;
        }

        const data = await response.json();

        setServices(data.services || []);
        setChatTone(data.chat_tone || "");
      } catch (error) {
        console.error("Error fetching services:", error);
      } finally {
        setIsLoading(false); // Set loading to false when fetching completes (success or error)
      }
    };

    if (isAuthChecked) {
      fetchServices();
    }
  }, [isAuthChecked, locale, router]);

  const handleViewMore = (desc) => {
    setSelectedDescription(desc);
    setShowModal(true);
  };

  const fetchServiceDetails = async (serviceId, editMode = false) => {
    setIsLoadingService(true);
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `https://api.neurovisesolutions.com/service/${serviceId}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch service details: ${response.status}`);
      }

      const data = await response.json();
      setSelectedService(data);
      setEditForm({
        serviceName: data.serviceName,
        description: data.description,
        working_hours: data.working_hours || {},
      });
      setIsEditMode(editMode);
      setShowModal(true);
    } catch (error) {
      console.error("Error fetching service details:", error);
      alert(`Error loading service details: ${error.message}`);
    } finally {
      setIsLoadingService(false);
    }
  };

  // edit handler

  const handleSaveClick = () => {
    setConfirmationModal({
      isOpen: true,
      action: "save",
      payload: null,
      title: "Confirm Changes",
      message: "Are you sure you want to save these changes?",
      icon: <FaEdit className="text-teal-500 text-4xl mb-4" />,
      confirmText: "Save Changes",
      confirmColor: "bg-teal-600 hover:bg-teal-700",
    });
  };

  const handleUpdate = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const response = await fetch(
        `https://api.neurovisesolutions.com/service/${selectedService.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(editForm),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to update service");
      }

      const updated = await response.json();
      setServices((prev) =>
        prev.map((svc) =>
          String(svc.id) === String(updated.id) ? updated : svc
        )
      );
      setShowModal(false);
      setIsEditMode(false);
      setSelectedService(null);
    } catch (error) {
      console.error("Update error:", error);
      alert("Error updating service: " + error.message);
    }
  };

  // del handler

  const deleteService = async (serviceId) => {
    try {
      const res = await fetch(
        `https://api.neurovisesolutions.com/service/${serviceId}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.detail || "Failed to delete service");
      }

      const data = await res.json();
      return data;
    } catch (error) {
      console.error("Error deleting service:", error.message);
      throw error;
    }
  };

  const generateTimeOptions = () => {
    const times = [];
    for (let hour = 0; hour < 24; hour++) {
      for (let min = 0; min < 60; min += 30) {
        const formatted = `${String(hour).padStart(2, "0")}:${String(
          min
        ).padStart(2, "0")}`;
        times.push(formatted);
      }
    }
    return times;
  };

  const toggleServiceStatus = async (serviceId, currentStatus) => {
    try {
      const token = localStorage.getItem("access_token");
      const newStatus = !currentStatus;

      const response = await fetch(
        `https://api.neurovisesolutions.com/service/${serviceId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActive: newStatus }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update service status");
      }

      return await response.json();
    } catch (error) {
      console.error("Error toggling service status:", error);
      throw error; // Re-throw to handle in the calling function
    }
  };

  const handleDeleteClick = (id) => {
    const service = services.find((s) => s.id === id);
    setConfirmationModal({
      isOpen: true,
      action: "delete",
      payload: id,
      title: "Confirm Deletion",
      message: `Are you sure you want to delete "${service?.serviceName}"? This action cannot be undone.`,
      icon: <RiDeleteBinLine className="text-red-500 text-4xl mb-4" />,
      confirmText: "Delete",
      confirmColor: "bg-red-600 hover:bg-red-700",
    });
  };

  const handleToggleClick = (service) => {
    const newStatus = !service.isActive;
    setConfirmationModal({
      isOpen: true,
      action: "toggle",
      payload: {
        id: service.id,
        currentStatus: service.isActive,
      },
      title: newStatus ? "Activate Service" : "Deactivate Service",
      message: `Are you sure you want to ${
        newStatus ? "activate" : "deactivate"
      } "${service.serviceName}"?`,
      icon: newStatus ? (
        <BsToggle2On className="text-green-500 text-4xl mb-4" />
      ) : (
        <BsToggle2Off className="text-gray-500 text-4xl mb-4" />
      ),
      confirmText: newStatus ? "Activate" : "Deactivate",
      confirmColor: newStatus
        ? "bg-green-600 hover:bg-green-700"
        : "bg-gray-600 hover:bg-gray-700",
    });
  };

  const handleEditClick = (id) => {
    const service = services.find((s) => s.id === id);
    setConfirmationModal({
      isOpen: true,
      action: "edit",
      payload: id,
      title: "Edit Service",
      message: `You are about to edit "${service?.serviceName}". Proceed?`,
      icon: <FaEdit className="text-teal-500 text-4xl mb-4" />,
      confirmText: "Edit",
      confirmColor: "bg-teal-600 hover:bg-teal-700",
    });
  };

  const handleConfirm = async () => {
    try {
      if (confirmationModal.action === "delete") {
        await deleteService(confirmationModal.payload);
        setServices((prevList) =>
          prevList.filter(
            (service) =>
              String(service.id) !== String(confirmationModal.payload)
          )
        );
      } else if (confirmationModal.action === "toggle") {
        await toggleServiceStatus(
          confirmationModal.payload.id,
          confirmationModal.payload.currentStatus
        );
        setServices(
          services.map((service) =>
            service.id === confirmationModal.payload.id
              ? { ...service, isActive: !service.isActive }
              : service
          )
        );
      } else if (confirmationModal.action === "edit") {
        await fetchServiceDetails(confirmationModal.payload, true);
      } else if (confirmationModal.action === "save") {
        await handleUpdate();
      }
    } catch (error) {
      console.error("Error performing action:", error);
      alert(`Error: ${error.message}`);
    } finally {
      setConfirmationModal({ isOpen: false, action: null, payload: null });
    }
  };

  // Determine which services to display
  const displayedServices = showAllServices ? services : services.slice(0, 5);
  const hasMoreServices = services.length > 5;

  if (!isAuthChecked) {
    return null;
  }

  return (
    <div className="p-8 space-y-12 text-black min-h-screen bg-cyan-900 bg-gradient-to-tl  via-transparent  rtl:bg-gradient-to-br from-cyan-600 to-cyan-900">
      {/* <BackButton /> */}
    <div className="max-w-3xl mx-auto p-1 bg-gradient-to-r from-teal-900 via-teal-500 to-teal-600 rounded-3xl shadow-2xl mt-8">
   <div className="bg-[#0f172a] rounded-3xl p-8 text-center">
    <h1 className="text-5xl font-extrabold bg-gradient-to-r from-cyan-300 via-teal-400 to-emerald-500 text-transparent bg-clip-text drop-shadow-lg animate-fade-in">
      Admin Panel
    </h1>
  </div>
</div>



      {/* SERVICES TABLE */}
      <section className="py-5">
        <h1 className="text-4xl font-bold text-white mb-8 flex justify-center bg-slate-900 p-2 rounded-2xl">Services</h1>

        {isLoading ? (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <div className="mx-auto w-24 h-24 flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">Loading services...</h3>
            <p className="text-gray-500">Please wait while we fetch your services</p>
          </div>
        ) : services.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 bg-gray-700 rounded-lg px-3 py-5">
              {displayedServices.map((service, index) => (
                <div 
                  key={index} 
                  className={`relative rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-2xl ${service.isActive ? 'bg-white' : 'bg-gray-100'}`}
                >
                  {/* Status Badge - Moved to be part of the header row */}
                  <div className="p-6 pb-0">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-2 max-w-[70%]">
                        <h3 className="text-xl font-bold text-gray-800 truncate">
                          {service.serviceName}
                        </h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${service.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                 
                    </div>
                    
                    {/* Description with expand button */}
                    <div className="mt-4">
                      <p className="text-gray-600 text-sm line-clamp-3">
                        {service.description}
                      </p>
                      {service.description.length > 100 && (
                        <button
                          onClick={() => handleViewMore(service.description)}
                          className="text-teal-500 text-sm mt-1 hover:underline"
                        >
                          Read more
                        </button>
                      )}
                    </div>
                  </div>
                  
                  {/* Working Hours */}
                  <div className="p-6 pt-4">
                    <h4 className="text-sm font-semibold text-gray-500 mb-2">Working Hours</h4>
                    <div className="space-y-2">
                      {service.working_hours && Object.entries(service.working_hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between text-sm">
                          <span className="capitalize text-gray-700">{day}</span>
                          {hours.active ? (
                            <span className="text-gray-600">
                              {hours.start} - {hours.end}
                            </span>
                          ) : (
                            <span className="text-gray-400">Closed</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="border-t border-gray-200 p-4 bg-gray-50 flex justify-between">
                    <div className="flex space-x-3">
                      {/* View Button */}
                      <button
                        onClick={() => fetchServiceDetails(service.id)}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                        title="View details"
                      >
                        <IoEyeSharp className="h-5 w-5 text-teal-600" />
                      </button>
                      
                      {/* Edit Button */}
                      <button
                        onClick={() => fetchServiceDetails(service.id, true)}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                        title="Edit"
                      >
                        <FaEdit className="h-5 w-5 text-yellow-600" />
                      </button>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteClick(service.id)}
                        className="p-2 rounded-full hover:bg-gray-200 transition-colors"
                        title="Delete"
                      >
                        <RiDeleteBinLine className="h-5 w-5 text-red-600" />
                      </button>
                    </div>
                    
                    {/* Toggle Switch */}
                    <button 
                      onClick={() => handleToggleClick(service)}
                      className="flex items-center"
                    >
                      <div className={`relative rounded-full w-12 h-6 transition-colors ${service.isActive ? 'bg-green-500' : 'bg-gray-300'}`}>
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${service.isActive ? 'translate-x-7' : 'translate-x-1'}`}></div>
                      </div>
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Show More Button Card */}
              {hasMoreServices && !showAllServices && (
                <div className="bg-white rounded-xl overflow-hidden shadow-lg transition-all hover:shadow-2xl border-2 border-dashed border-gray-300">
                  <div className="p-6 flex flex-col items-center justify-center h-full min-h-[300px]">
                    <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <MdOutlineMiscellaneousServices className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      {services.length - 5} More Services
                    </h3>
                    <p className="text-gray-500 text-center mb-4">
                      Click to view all services
                    </p>
                    <button
                      onClick={() => setShowAllServices(true)}
                      className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium"
                    >
                      Show More
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Show Less Button */}
            {showAllServices && hasMoreServices && (
              <div className="mt-6 text-center">
                <button
                  onClick={() => setShowAllServices(false)}
                  className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium"
                >
                  Show Less
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-xl p-8 text-center shadow-sm">
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <MdOutlineMiscellaneousServices className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No services available</h3>
            <p className="text-gray-500">There are currently no services to display</p>
          </div>
        )}
      </section>

      {/* CHAT HISTORY TABLE (static for now) */}
      <section>
        <h2 className="text-4xl w-full mx-auto flex justify-center font-bold mb-6 bg-slate-900 p-2 rounded-2xl text-white">Chat History</h2>
        <ChatHistory />
      </section>

      {/* MODAL FOR FULL DESCRIPTION */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50  z-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg max-w-xl w-full max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-semibold mb-4">
              {isEditMode
                ? "Edit Service"
                : selectedService
                ? "Service Details"
                : "Full Description"}
            </h2>

            {isLoadingService ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : selectedService ? (
              <div className="space-y-4">
                {isEditMode ? (
                  <>
                    <div>
                      <label className="block font-medium">Service Name</label>
                      <input
                        className="border p-2 rounded w-full"
                        value={editForm.serviceName}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            serviceName: e.target.value,
                          }))
                        }
                      />
                    </div>
                 
                    <div>
                      <label className="block font-medium">Description</label>
                      <textarea
                        className="border p-2 rounded w-full"
                        value={editForm.description}
                        onChange={(e) =>
                          setEditForm((prev) => ({
                            ...prev,
                            description: e.target.value,
                          }))
                        }
                      />
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        Working hours{" "}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(editForm.working_hours || {}).map(
                          ([day, hours]) => (
                            <div
                              key={day}
                              className="border rounded-lg p-3 space-y-2"
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium capitalize">
                                  {day}
                                </span>
                                <label className="flex items-center space-x-2 text-sm">
                                  <input
                                    type="checkbox"
                                    checked={hours.active}
                                    onChange={(e) =>
                                      setEditForm((prev) => ({
                                        ...prev,
                                        working_hours: {
                                          ...prev.working_hours,
                                          [day]: {
                                            ...prev.working_hours[day],
                                            active: e.target.checked,
                                          },
                                        },
                                      }))
                                    }
                                  />
                                  <span>{hours.active ? "open" : "close"}</span>
                                </label>
                              </div>

                              {hours.active && (
                                <div className="flex justify-between text-sm text-gray-600 space-x-2">
                                  {/* Start Time */}
                                  <select
                                    value={hours.start}
                                    onChange={(e) =>
                                      setEditForm((prev) => ({
                                        ...prev,
                                        working_hours: {
                                          ...prev.working_hours,
                                          [day]: {
                                            ...prev.working_hours[day],
                                            start: e.target.value,
                                          },
                                        },
                                      }))
                                    }
                                    className="border p-1 rounded w-full"
                                  >
                                    {generateTimeOptions().map((time) => (
                                      <option key={time} value={time}>
                                        {time}
                                      </option>
                                    ))}
                                  </select>

                                  <span className="self-center">to</span>

                                  {/* End Time */}
                                  <select
                                    value={hours.end}
                                    onChange={(e) =>
                                      setEditForm((prev) => ({
                                        ...prev,
                                        working_hours: {
                                          ...prev.working_hours,
                                          [day]: {
                                            ...prev.working_hours[day],
                                            end: e.target.value,
                                          },
                                        },
                                      }))
                                    }
                                    className="border p-1 rounded w-full"
                                  >
                                    {generateTimeOptions().map((time) => (
                                      <option key={time} value={time}>
                                        {time}
                                      </option>
                                    ))}
                                  </select>
                                </div>
                              )}
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Service Name
                      </h3>
                      <p className="text-gray-700">
                        {selectedService.serviceName}
                      </p>
                    </div>
                 
                    <div>
                      <h3 className="font-medium text-gray-900">Description</h3>
                      <p className="text-gray-700">
                        {selectedService.description}
                      </p>
                    </div>
                
                    <div>
                      <h3 className="font-medium text-gray-900">Status</h3>
                      <p className="text-gray-700">
                        <span
                          className={`inline-block w-3 h-3 rounded-full mr-2 ${
                            selectedService.isActive
                              ? "bg-green-500"
                              : "bg-red-500"
                          }`}
                        ></span>
                        {selectedService.isActive ? "Active" : "Inactive"}
                      </p>
                    </div>

                    <div>
                      <h3 className="font-medium text-gray-900 mb-2">
                        Working Hours
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedService.working_hours &&
                          Object.entries(selectedService.working_hours).map(
                            ([day, hours]) => (
                              <div key={day} className="border rounded-lg p-3">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-medium capitalize">
                                    {day}
                                  </span>
                                  <span
                                    className={`text-xs px-2 py-1 rounded ${
                                      hours.active
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {hours.active ? "Open" : "Closed"}
                                  </span>
                                </div>
                                {hours.active && (
                                  <div className="flex justify-between text-sm text-gray-600">
                                    <span>{hours.start}</span>
                                    <span>to</span>
                                    <span>{hours.end}</span>
                                  </div>
                                )}
                              </div>
                            )
                          )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <p className="text-gray-700">{selectedDescription}</p>
            )}

            <div className="mt-6 text-right space-x-2">
              {selectedService && (
                <>
                  {isEditMode ? (
                    <button
                      onClick={handleSaveClick}
                      className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditMode(true)}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded"
                    >
                      Edit
                    </button>
                  )}
                </>
              )}
              <button
                onClick={() => {
                  setShowModal(false);
                  setSelectedService(null);
                  setIsEditMode(false);
                }}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Beautiful Confirmation Modal */}
      {confirmationModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden">
            <div className="p-6 text-center">
              {confirmationModal.icon}
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                {confirmationModal.title}
              </h3>
              <p className="text-gray-600 mb-6">{confirmationModal.message}</p>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() =>
                    setConfirmationModal({
                      isOpen: false,
                      action: null,
                      payload: null,
                    })
                  }
                  className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className={`px-6 py-2 border border-transparent rounded-md text-white ${confirmationModal.confirmColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors`}
                >
                  {confirmationModal.confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}