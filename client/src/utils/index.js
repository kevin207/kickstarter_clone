export const daysLeft = (deadline) => {
  const difference = new Date(deadline).getTime() - Date.now();
  const remainingDays = difference / (1000 * 3600 * 24);

  if (remainingDays > 0) {
    return remainingDays.toFixed(0);
  } else {
    return 0;
  }
};

export const calculateBarPercentage = (goal, raisedAmount) => {
  const percentage = Math.round((raisedAmount * 100) / goal);

  return percentage;
};

export const checkIfImage = (url, callback) => {
  const img = new Image();
  img.src = url;

  if (img.complete) callback(true);

  img.onload = () => callback(true);
  img.onerror = () => callback(false);
};

export const checkIfActive = (deadline) => {
  const current = new Date();
  deadline = new Date(deadline);

  if (current >= deadline) {
    return false;
  } else {
    return true;
  }
};

export const checkIfTargetMet = (collected, target) => {
  if (collected >= target) {
    return true;
  } else {
    return false;
  }
};

export const formatDate = (timestamp) => {
  const dateObj = new Date(timestamp);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const day = dateObj.getDate();
  const monthIndex = dateObj.getMonth();
  const year = dateObj.getFullYear();
  const dayOfWeek = dateObj.toLocaleDateString("en-US", { weekday: "long" });

  const formattedDate = `${dayOfWeek}, ${day} ${monthNames[monthIndex]} ${year}`;

  return formattedDate;
};
