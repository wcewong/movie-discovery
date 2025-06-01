export const formatVoteAverage = (voteAverage: number): string => {
  return voteAverage.toFixed(1);
};

export const formatReleaseDate = (dateInput: string | Date): string => {
  let date: Date;

  if (typeof dateInput === "string") {
    date = new Date(dateInput);
  } else {
    date = dateInput;
  }

  if (isNaN(date.getTime())) {
    return "Unknown";
  }

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
