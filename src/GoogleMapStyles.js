export const mapWrapperStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: "100vh",
  width: "100%",
  cursor: "default",
};

export const mapContainerStyle = {
  height: "90vh",
  width: "90%",
  borderRadius: "10px",
  boxShadow: "0 4x 8px rgba(0,0,0,0.2)",
  cursor: "pointer !important",
};

export const infoWindowStyle = {
  padding: "10px",
  width: "200px",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  backgroundColor: "#fff",
  height: "fit-content",
};

export const headingStyle = {
  fontSize: "18px",
  marginBottom: "10px",
  color: "#333",
  fontWeight: "bold",
  textAlign: "center",
};

export const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

export const formGroupStyle = {
  display: "flex",
  flexDirection: "column",
};

export const labelStyle = {
  marginBottom: "5px",
  fontSize: "14px",
  color: "#666",
};

export const inputStyle = {
  padding: "8px",
  fontSize: "10px",
  borderRadius: "5px",
  border: "1px solid #ccc",
  width: "90%",
};

export const buttonStyle = {
  padding: "10px",
  fontSize: "10px",
  backgroundColor: "#007BFF",
  color: "#fff",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  transition: "background-color 0.3s",
};

buttonStyle[":hover"] = {
  backgroundColor: "#0056b3",
};
