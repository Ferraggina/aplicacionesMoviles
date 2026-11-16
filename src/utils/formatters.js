export const formatReminder = (isoString) => {
  if (!isoString) return null;
  const date = new Date(isoString);
  if (isNaN(date.getTime())) return null;
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${dd}/${mm} ${hh}:${min}`;
};
export const formatLocation = (location) => {
  if (!location) return null;
  if (location.address) return location.address;
  return `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}`;
};

export const buildMapsUrl = (location) =>
  `https://www.google.com/maps/search/?api=1&query=${location.latitude},${location.longitude}`;

export const formatContact = (contact) => {
  if (!contact) return null;
  return contact.phone ? `${contact.name} · ${contact.phone}` : contact.name;
};
