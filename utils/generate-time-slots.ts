// Generate time slots for all 24 hours in 30-min increments
export const generateTimeSlots = () => {
  const slots: string[] = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let min of [0, 30]) {
      const h = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
      const period = hour >= 12 ? "PM" : "AM";
      const time = `${h}:${min.toString().padStart(2, "0")} ${period}`;
      slots.push(time);
    }
  }
  return slots;
};
