import React, { useState, useEffect, useContext } from "react";
import { Upload } from "lucide-react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Reports = () => {
    const [file, setFile] = useState(null);
    const [summary, setSummary] = useState("");
    const [previousReports, setPreviousReports] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");
    const { backendUrl, token } = useContext(AppContext);
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch previous reports on component mount
        const fetchPreviousReports = async () => {
            try {
                const response = await axios.get(
                    `${backendUrl}/api/user/previous-reports`,
                    { headers: { token } }
                );
                setPreviousReports(response.data.data);
            } catch (error) {
                console.error("Error fetching previous reports:", error);
                setError("Failed to load previous reports");
            }
        };

        if (token) {
            fetchPreviousReports();
        } else {
            navigate("/");
        }
    }, []);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(""); // Clear any previous errors
        }
    };

    const handleUpload = async () => {
        if (!file) return;

        setIsLoading(true);
        setError("");
        const formData = new FormData();
        formData.append("report", file);

        try {
            const response = await axios.post(
                `${backendUrl}/api/user/get-summary`,
                formData,
                {
                    headers: {
                        token,
                        "Content-Type": "multipart/form-data",
                    },
                }
            );
            setSummary(response.data.data.summary);
            setFile(null);
        } catch (error) {
            console.error("Error uploading report:", error);
            setError(
                error.response?.data?.message || "Failed to upload report"
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-8">
                Medical Reports Summary
            </h1>

            {/* Upload Section */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-[#5f6fff] border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Upload className="w-10 h-10 mb-3 text-[#5f6fff]" />
                            <p className="mb-2 text-sm text-gray-500">
                                <span className="font-semibold">
                                    Click to upload
                                </span>
                            </p>
                            <p className="text-xs text-gray-500">
                                PDF (MAX. 10MB)
                            </p>
                        </div>
                        <input
                            type="file"
                            className="hidden"
                            accept=".pdf"
                            onChange={handleFileChange}
                        />
                    </label>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg text-sm">
                        {error}
                    </div>
                )}

                {file && (
                    <div className="mt-4 flex justify-between items-center">
                        <span className="text-sm text-gray-600">
                            {file.name}
                        </span>
                        <button
                            onClick={handleUpload}
                            disabled={isLoading}
                            className="bg-[#5f6fff] text-white px-4 py-2 rounded-lg hover:bg-[#4b5aff] transition-colors disabled:opacity-50"
                        >
                            {isLoading ? "Processing..." : "Get Summary"}
                        </button>
                    </div>
                )}

                {/* Current Summary */}
                {summary && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="font-medium mb-2">Summary</h3>
                        <p className="text-gray-600">{summary}</p>
                    </div>
                )}
            </div>

            {/* Previous Reports Section */}
            <div className="space-y-6">
                <h2 className="text-xl font-medium">Previous Reports</h2>
                {previousReports.length === 0 ? (
                    <p className="text-gray-500">No previous reports found</p>
                ) : (
                    previousReports.map((report, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-lg shadow-sm border border-gray-100 p-6"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-medium">
                                        Report {index + 1}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        {report.date}
                                    </p>
                                </div>
                                <a
                                    href={report.reportUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#5f6fff] hover:text-[#4b5aff] text-sm font-medium"
                                >
                                    View PDF
                                </a>
                            </div>
                            <p className="text-gray-600">{report.summary}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Reports;
