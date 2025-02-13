const sendResponse = <T>({
  message,
  status,
  data,
  success,
}: {
  message: string;
  success: boolean;
  status: number;
  data: T;
}) => {
  return {
    success,
    message,
    data,
    status,
  };
};

export default sendResponse;
