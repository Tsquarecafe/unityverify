export const generateCSVFile = (ourData: any[]) => {
  const titleKeys = Object.keys(ourData[0]);

  const refinedData = [];
  refinedData.push(titleKeys);

  ourData.forEach((item) => {
    refinedData.push(Object.values(item));
  });

  let csvContent = "";

  refinedData.forEach((row) => {
    csvContent += row.join(",") + "\n";
  });

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8," });
  const objUrl = URL.createObjectURL(blob);
  return objUrl;
};
