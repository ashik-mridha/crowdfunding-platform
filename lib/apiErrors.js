// Maps our { success:false, error:{ code, message, details:[{field,message}] } } shape onto a form.
export function applyApiErrors(err, setError, fields) {
  const apiError = err.response?.data?.error;
  if (!apiError) {
    return err.code === "ERR_NETWORK"
      ? "We could not reach the server. Check your connection and try again."
      : "Something went wrong. Please try again.";
  }
  if (apiError.code === "EMAIL_EXISTS") {
    setError("email", { message: "An account with this email already exists" });
    return null;
  }
  if (apiError.code === "VALIDATION_ERROR" && Array.isArray(apiError.details)) {
    let mapped = false;
    for (const d of apiError.details) {
      if (fields.includes(d.field)) {
        setError(d.field, { message: d.message });
        mapped = true;
      }
    }
    if (mapped) return null;
  }
  return apiError.message || "Something went wrong. Please try again.";
}
