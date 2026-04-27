"use client";

import { useEffect, useState } from "react";
import { IoEyeSharp } from "react-icons/io5";
import { RiDeleteBinLine } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import { BsToggle2Off } from "react-icons/bs";
import { BsToggle2On } from "react-icons/bs";
import { useRouter, useParams } from "next/navigation";
import { MdOutlineMiscellaneousServices } from "react-icons/md"; // Service icon
import { apiUrl } from "@/lib/api";


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
  }, [locale, router]);

  useEffect(() => {
    const fetchServices = async () => {
      setIsLoading(true); // Set loading to true when fetching starts
      try {
        const token = localStorage.getItem("access_token");

        const response = await fetch(
          apiUrl("/business-service"),
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
        apiUrl(`/service/${serviceId}`),
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
        apiUrl(`/service/${selectedService.id}`),
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
        apiUrl(`/service/${serviceId}`),
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
        apiUrl(`/service/${serviceId}`),
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
    <div className="space-y-8 rounded-xl bg-slate-950/60 p-4 text-black md:p-6">
  



      {/* SERVICES TABLE */}
      <section className="py-2">
        <h1 className="mb-6 flex justify-center rounded-2xl border border-slate-700 bg-slate-900 p-3 text-3xl font-bold text-slate-100">
          Services List
        </h1>

        {isLoading ? (
          <div className="rounded-xl border border-slate-700 bg-slate-900 p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center">
              <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-cyan-400"></div>
            </div>
            <h3 className="mb-2 text-xl font-medium text-slate-100">Loading services...</h3>
            <p className="text-slate-400">Please wait while we fetch your services</p>
          </div>
        ) : services.length > 0 ? (
          <>
            <div className="grid grid-cols-1 gap-6 rounded-lg bg-slate-800/80 px-3 py-5 md:grid-cols-2 lg:grid-cols-3">
              {displayedServices.map((service, index) => (
                <div 
                  key={index} 
                  className={`relative flex h-full flex-col overflow-hidden rounded-xl border shadow-lg transition-all hover:border-cyan-500/40 hover:shadow-2xl ${
                    service.isActive
                      ? "border-slate-700 bg-slate-900"
                      : "border-slate-700 bg-slate-900/80"
                  }`}
                >
                  {/* Status Badge - Moved to be part of the header row */}
                  <div className="p-6 pb-0">
                    <div className="flex justify-between items-start">
                      <div className="flex items-start space-x-2 max-w-[70%]">
                        <h3 className="truncate text-xl font-bold text-slate-100">
                          {service.serviceName}
                        </h3>
                        <span className={`rounded-full px-2 py-1 text-xs font-semibold ${service.isActive ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/40' : 'bg-slate-700 text-slate-300 border border-slate-600'}`}>
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                 
                    </div>
                    
                    {/* Description with expand button */}
                    <div className="mt-4 min-h-[5.75rem]">
                      <p className="line-clamp-3 min-h-[3.75rem] text-sm text-slate-300">
                        {service.description}
                      </p>
                      <div className="mt-1 h-5">
                        {service.description.length > 100 && (
                          <button
                            onClick={() => handleViewMore(service.description)}
                            className="text-sm text-cyan-300 hover:underline"
                          >
                            Read more
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Working Hours */}
                  <div className="p-6 pt-4">
                    <h4 className="mb-2 text-sm font-semibold text-slate-400">Working Hours</h4>
                    <div className="space-y-2">
                      {service.working_hours && Object.entries(service.working_hours).map(([day, hours]) => (
                        <div key={day} className="flex justify-between text-sm">
                          <span className="capitalize text-slate-300">{day}</span>
                          {hours.active ? (
                            <span className="text-slate-300">
                              {hours.start} - {hours.end}
                            </span>
                          ) : (
                            <span className="text-slate-500">Closed</span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex justify-between border-t border-slate-700 bg-slate-950 p-4">
                    <div className="flex space-x-3">
                      {/* View Button */}
                      <button
                        onClick={() => fetchServiceDetails(service.id)}
                        className="rounded-full p-2 transition-colors hover:bg-slate-800"
                        title="View details"
                      >
                        <IoEyeSharp className="h-5 w-5 text-cyan-300" />
                      </button>
                      
                      {/* Edit Button */}
                      <button
                        onClick={() => fetchServiceDetails(service.id, true)}
                        className="rounded-full p-2 transition-colors hover:bg-slate-800"
                        title="Edit"
                      >
                        <FaEdit className="h-5 w-5 text-amber-300" />
                      </button>
                      
                      {/* Delete Button */}
                      <button
                        onClick={() => handleDeleteClick(service.id)}
                        className="rounded-full p-2 transition-colors hover:bg-slate-800"
                        title="Delete"
                      >
                        <RiDeleteBinLine className="h-5 w-5 text-rose-300" />
                      </button>
                    </div>
                    
                    {/* Toggle Switch */}
                    <button 
                      onClick={() => handleToggleClick(service)}
                      className="flex items-center"
                    >
                      <div className={`relative h-6 w-12 rounded-full transition-colors ${service.isActive ? 'bg-emerald-500' : 'bg-slate-600'}`}>
                        <div className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${service.isActive ? 'translate-x-7' : 'translate-x-1'}`}></div>
                      </div>
                    </button>
                  </div>
                </div>
              ))}
              
              {/* Show More Button Card */}
              {hasMoreServices && !showAllServices && (
                <div className="overflow-hidden rounded-xl border-2 border-dashed border-slate-600 bg-slate-900 shadow-lg transition-all hover:border-cyan-500/40 hover:shadow-2xl">
                  <div className="p-6 flex flex-col items-center justify-center h-full min-h-[300px]">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-800">
                      <MdOutlineMiscellaneousServices className="h-8 w-8 text-slate-400" />
                    </div>
                    <h3 className="mb-2 text-lg font-medium text-slate-200">
                      {services.length - 5} More Services
                    </h3>
                    <p className="mb-4 text-center text-slate-400">
                      Click to view all services
                    </p>
                    <button
                      onClick={() => setShowAllServices(true)}
                      className="rounded-lg bg-cyan-500 px-6 py-3 font-medium text-slate-950 transition-colors hover:bg-cyan-400"
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
                  className="rounded-lg bg-slate-700 px-6 py-3 font-medium text-white transition-colors hover:bg-slate-600"
                >
                  Show Less
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="rounded-xl border border-slate-700 bg-slate-900 p-8 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-slate-800">
              <MdOutlineMiscellaneousServices className="h-12 w-12 text-slate-400" />
            </div>
            <h3 className="mb-2 text-xl font-medium text-slate-100">No services available</h3>
            <p className="text-slate-400">There are currently no services to display</p>
          </div>
        )}
      </section>

      {/* MODAL FOR FULL DESCRIPTION */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="max-h-[80vh] w-full max-w-xl overflow-y-auto rounded-xl border border-slate-700 bg-slate-950 p-6 shadow-2xl shadow-cyan-950/40">
            <h2 className="mb-4 text-xl font-semibold text-slate-100">
              {isEditMode
                ? "Edit Service"
                : selectedService
                ? "Service Details"
                : "Full Description"}
            </h2>

            {isLoadingService ? (
              <div className="flex justify-center items-center py-8">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-cyan-400"></div>
              </div>
            ) : selectedService ? (
              <div className="space-y-4">
                {isEditMode ? (
                  <>
                    <div>
                      <label className="block font-medium text-slate-200">Service Name</label>
                      <input
                        className="w-full rounded-lg border border-slate-600 bg-slate-900 p-2 text-slate-100"
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
                      <label className="block font-medium text-slate-200">Description</label>
                      <textarea
                        className="w-full rounded-lg border border-slate-600 bg-slate-900 p-2 text-slate-100"
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
                      <h3 className="mb-2 font-medium text-slate-200">
                        Working hours{" "}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {Object.entries(editForm.working_hours || {}).map(
                          ([day, hours]) => (
                            <div
                              key={day}
                              className="space-y-2 rounded-lg border border-slate-700 bg-slate-900 p-3"
                            >
                              <div className="flex justify-between items-center">
                                <span className="font-medium capitalize text-slate-200">
                                  {day}
                                </span>
                                <label className="flex items-center space-x-2 text-sm text-slate-300">
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
                                <div className="flex justify-between space-x-2 text-sm text-slate-300">
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
                                    className="w-full rounded border border-slate-600 bg-slate-950 p-1 text-slate-100"
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
                                    className="w-full rounded border border-slate-600 bg-slate-950 p-1 text-slate-100"
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
                      <h3 className="font-medium text-slate-200">
                        Service Name
                      </h3>
                      <p className="text-slate-300">
                        {selectedService.serviceName}
                      </p>
                    </div>
                 
                    <div>
                      <h3 className="font-medium text-slate-200">Description</h3>
                      <p className="text-slate-300">
                        {selectedService.description}
                      </p>
                    </div>
                
                    <div>
                      <h3 className="font-medium text-slate-200">Status</h3>
                      <p className="text-slate-300">
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
                      <h3 className="mb-2 font-medium text-slate-200">
                        Working Hours
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {selectedService.working_hours &&
                          Object.entries(selectedService.working_hours).map(
                            ([day, hours]) => (
                              <div key={day} className="rounded-lg border border-slate-700 bg-slate-900 p-3">
                                <div className="flex justify-between items-center mb-1">
                                  <span className="font-medium capitalize text-slate-200">
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
                                  <div className="flex justify-between text-sm text-slate-300">
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
              <p className="text-slate-300">{selectedDescription}</p>
            )}

            <div className="mt-6 text-right space-x-2">
              {selectedService && (
                <>
                  {isEditMode ? (
                    <button
                      onClick={handleSaveClick}
                      className="rounded bg-cyan-500 px-4 py-2 text-slate-950 transition hover:bg-cyan-400"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditMode(true)}
                      className="rounded bg-amber-500 px-4 py-2 text-slate-950 transition hover:bg-amber-400"
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
                className="rounded bg-rose-600 px-4 py-2 text-white transition hover:bg-rose-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Beautiful Confirmation Modal */}
      {confirmationModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-xl border border-slate-700 bg-slate-950 shadow-xl shadow-cyan-950/40">
            <div className="p-6 text-center">
              {confirmationModal.icon}
              <h3 className="mb-2 text-2xl font-bold text-slate-100">
                {confirmationModal.title}
              </h3>
              <p className="mb-6 text-slate-300">{confirmationModal.message}</p>

              <div className="flex justify-center space-x-4">
                <button
                  onClick={() =>
                    setConfirmationModal({
                      isOpen: false,
                      action: null,
                      payload: null,
                    })
                  }
                  className="rounded-md border border-slate-600 bg-slate-900 px-6 py-2 text-slate-200 transition-colors hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirm}
                  className={`rounded-md border border-transparent px-6 py-2 text-white ${confirmationModal.confirmColor} transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500`}
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