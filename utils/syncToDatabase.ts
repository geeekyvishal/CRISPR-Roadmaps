export const saveToDatabase = async () => {
    const roadmap = localStorage.getItem('roadmap');
    if (!roadmap) return;
  
    const data = JSON.parse(roadmap);
  
    const res = await fetch('/api/save-document', {
      method: 'POST', // use PUT if updating existing
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
  
    const result = await res.json();
    console.log('Synced to DB:', result);
  };
  