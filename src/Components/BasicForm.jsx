import { useEffect, useState } from "react";
import Spinner from "./Spinner";
import toast, { Toaster } from "react-hot-toast";

function App() {
  const [formData, setFormData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Simulated GET Call
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setFormData({
        name: "Banti Kumar Das",
        email: "bantikumardas43@gmail.com",
        age: 25,
        gender: "Male",
        phone: "8409157529",
      });
      setLoading(false);
    }, 2000);
  }, []);

  // Handle changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Validations
  const isValidEmail = (email) => {
    if (email.length < 5) return false;
    const atIndex = email.indexOf("@");
    const dotIndex = email.lastIndexOf(".");
    return atIndex > 0 && dotIndex > atIndex + 1 && dotIndex < email.length - 1;
  };
  const isValidPhone = (phone) => {
    for (let char of phone) {
      if (char < "0" || char > "9") return false;
    }
    return phone.length === 10;
  };

  // Save handler
  const handleSave = () => {
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.age ||
      !formData.gender ||
      !formData.phone.trim()
    ) {
      toast.error("All fields are required.");
      return;
    }
    if (!isValidEmail(formData.email)) {
      toast.error("Invalid email format.");
      return;
    }
    if (!isValidPhone(formData.phone)) {
      toast.error("Invalid phone number.");
      return;
    }
    if (formData.age > 120) {
      toast.error("Invalid age. please check");
      return;
    }

    setSaving(true);

    setTimeout(() => {
      toast.success("Data saved successfully!");
      setSaving(false);
      setFormData(null);
    }, 2000);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-r from-indigo-100 via-white to-indigo-200 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl relative">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-800">
          User Form
        </h1>

        {loading ? (
          <Spinner />
        ) : (
          <>
            {/* Input Fields */}
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={formData?.name || ""}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
                placeholder="Full Name"
              />
              <input
                type="email"
                name="email"
                value={formData?.email || ""}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
                placeholder="Email"
              />
              <input
                type="number"
                name="age"
                value={formData?.age || ""}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
                placeholder="Age"
              />
              <select
                name="gender"
                value={formData?.gender || ""}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>

              <input
                type="tel"
                name="phone"
                value={formData?.phone || ""}
                onChange={handleChange}
                className="w-full rounded-lg border p-3"
                placeholder="Phone Number"
              />
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={saving}
              className="mt-6 w-full rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 py-3 text-lg font-semibold text-white shadow-lg transition hover:scale-105 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save"}
            </button>

            {saving && <Spinner />}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
