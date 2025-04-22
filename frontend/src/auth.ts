export const getUserIdFromToken = (): string | null => {
    const token = localStorage.getItem("token");
    if (!token) return null;
  
    try {
      // JWT format: header.payload.signature
      const payload = token.split(".")[1];
      const decodedPayload = JSON.parse(atob(payload));
  
      // Look for user ID in common claim names
      return decodedPayload.sub || decodedPayload.id || decodedPayload.nameid || null;
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  };