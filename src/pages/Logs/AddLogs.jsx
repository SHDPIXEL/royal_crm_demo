import React, { useState } from "react";
import { User, Phone, IndianRupee, FileText, ArrowDown, ArrowUp, Loader } from "lucide-react";
import { toast } from "react-hot-toast";
import API from "../../lib/utils";
import { useNavigate } from "react-router-dom";

const AddLogs = () => {
  const [formData, setFormData] = useState({
    name: "",
    mobile: "",
    amount: "",
    type: "",
    remark: ""
  });

  const [errors, setErrors] = useState({
    name: "",
    mobile: "",
    amount: "",
    type: ""
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Phone validation - allow only numbers and max 10 digits
    if (name === "mobile") {
      if (!/^\d*$/.test(value)) {
        return; // Don't update if non-numeric
      }
      if (value.length > 10) {
        return; // Don't update if more than 10 digits
      }
    }

    // Amount validation - only numbers and decimals
    if (name === "amount") {
      if (!/^\d*\.?\d*$/.test(value)) {
        return; // Don't update if invalid amount format
      }
    }

    setFormData({ ...formData, [name]: value });

    // Clear error for this field if any
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  // Validate form
  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      isValid = false;
    }

    // mobile validation
    if (!formData.mobile) {
      newErrors.mobile = "Phone number is required";
      isValid = false;
    } else if (formData.mobile.length < 10) {
      newErrors.mobile = "Phone number must be 10 digits";
      isValid = false;
    }

    // Amount validation
    if (!formData.amount) {
      newErrors.amount = "Amount is required";
      isValid = false;
    } else if (isNaN(parseFloat(formData.amount)) || parseFloat(formData.amount) <= 0) {
      newErrors.amount = "Amount must be a positive number";
      isValid = false;
    }

    // Type validation
    if (!formData.type) {
      newErrors.type = "Payment type is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }
    try {
      setIsLoading(true);
      const response = await API.post("/admin/createForm", formData);
      if (response.status === 201) {
        navigate("/logs/list")
      }
      toast.success("Payment entry saved successfully!");
      setFormData({
        name: "",
        mobile: "",
        amount: "",
        type: "",
        remark: ""
      });
    } catch (error) {
      console.error("Error submitting data", error);
      toast.error("Failed to submit entry. Please try again.", { position: "top-right" });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Payment Entry</h1>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
        {/* Name */}
        <div className="flex flex-col">
          <label
            htmlFor="name"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <User className="h-4 w-4 text-gray-400" />
            User Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className={`p-3 rounded-lg border ${errors.name ? "border-red-500" : "border-gray-300"
              } shadow-sm transition-all duration-200`}
            placeholder="Enter full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        {/* mobile */}
        <div className="flex flex-col">
          <label
            htmlFor="mobile"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <Phone className="h-4 w-4 text-gray-400" />
            Phone Number
          </label>
          <input
            type="text"
            name="mobile"
            id="mobile"
            value={formData.mobile}
            onChange={handleChange}
            className={`p-3 rounded-lg border ${errors.mobile ? "border-red-500" : "border-gray-300"
              } shadow-sm transition-all duration-200`}
            placeholder="Enter 10-digit phone number"
          />
          {errors.mobile && (
            <p className="mt-1 text-sm text-red-500">{errors.mobile}</p>
          )}
        </div>

        {/* Amount */}
        <div className="flex flex-col">
          <label
            htmlFor="amount"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <IndianRupee className="h-4 w-4 text-gray-400" />
            Amount
          </label>
          <input
            type="text"
            name="amount"
            id="amount"
            value={formData.amount}
            onChange={handleChange}
            className={`p-3 rounded-lg border ${errors.amount ? "border-red-500" : "border-gray-300"
              } shadow-sm transition-all duration-200`}
            placeholder="Enter amount"
          />
          {errors.amount && (
            <p className="mt-1 text-sm text-red-500">{errors.amount}</p>
          )}
        </div>

        {/* Payment Type */}
        <div className="flex flex-col">
          <label
            className="text-sm font-medium text-gray-700 mb-2"
          >
            Payment Type
          </label>
          <div className="flex gap-4">
            <div
              className={`flex-1 flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${formData.type === "IN"
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 hover:border-gray-400"
                }`}
              onClick={() => setFormData({ ...formData, type: "IN" })}
            >
              <ArrowDown className={`h-5 w-5 ${formData.type === "IN" ? "text-green-500" : "text-gray-400"}`} />
              <span className={formData.type === "IN" ? "font-medium" : ""}>Inflow (Received)</span>
            </div>
            <div
              className={`flex-1 flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-all duration-200 ${formData.type === "OUT"
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-gray-400"
                }`}
              onClick={() => setFormData({ ...formData, type: "OUT" })}
            >
              <ArrowUp className={`h-5 w-5 ${formData.type === "OUT" ? "text-red-500" : "text-gray-400"}`} />
              <span className={formData.type === "OUT" ? "font-medium" : ""}>Outflow (Paid)</span>
            </div>
          </div>
          {errors.type && (
            <p className="mt-1 text-sm text-red-500">{errors.type}</p>
          )}
        </div>

        {/* Remarks */}
        <div className="flex flex-col">
          <label
            htmlFor="remark"
            className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
          >
            <FileText className="h-4 w-4 text-gray-400" />
            Remarks (Optional)
          </label>
          <textarea
            name="remark"
            id="remark"
            value={formData.remark}
            onChange={handleChange}
            className="p-3 rounded-lg border border-gray-300 shadow-sm transition-all duration-200"
            placeholder="Add any additional information"
            rows="3"
          />
        </div>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            className={`w-full min-w-[200px] px-6 py-3 ${isLoading ? "bg-gray-900" : "bg-black"} text-white font-medium rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all duration-200 shadow-sm flex items-center justify-center gap-2`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <Loader className="animate-spin h-5 w-5" />
                Saving Entry...
              </span>
            ) : (
              "Save Payment Entry"
            )}
          </button>

        </div>
      </form>
    </div>
  );
};

export default AddLogs;