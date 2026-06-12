import Axios from "axios";

const readToken =
  "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxOTUxMjgzMDk5LCJpYXQiOjE2ODg0ODMwOTksImp0aSI6IjA2MTRlZDg3N2I1ZTRkZjVhYjhkYjVlZWJlMWQ0NWFjIiwidXNlcl9pZCI6IjllZWYxYTEyLTVmOTUtNDIyOC1hMjFlLTExMjg3YmIwY2Q5NSIsIm5hbWUiOiJzbWFydCBhZG1pbiIsInJvbGVzIjpbInN1cGVydXNlciJdLCJpc19zdXBlcnVzZXIiOnRydWV9.B29Hr_nhyK9g4nQxB9CdcuAhEjXo1mI2qyoP4ZZ38Ng";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const receiptStatus = async (data) => {
  const res = await Axios.get(`${API_URL}/receipt_status`, {
    headers: {
      authorization: "Bearer " + localStorage.getItem("access-token"),
    },
  });
  return res.data;
};