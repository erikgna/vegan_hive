export const formatDateString = (dateString: string) => {
  const date = new Date(dateString);

  const formattedTime = date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const formattedDate = date.toLocaleDateString([], {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });

  const timeParts = formattedTime.split(" ");
  const dateParts = formattedDate.split("/");

  return `${timeParts[0]} - ${dateParts[0]}/${dateParts[1]}/${dateParts[2]}`;
};
