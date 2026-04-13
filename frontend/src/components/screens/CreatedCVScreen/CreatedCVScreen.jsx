// import { useState, useEffect } from "react";
// import { loadState, saveState, generateId } from "../../../utils/storage"
// import { EMPTY_CV } from "../../../utils/constants"
// import MyCVScreen from "./../MyCVScreen/MyCVScreen"
// import TemplatePickerScreen from "./../TemplatePickerScreen/TemplatePickerScreen"
// import EditorScreen from "./../EditorScreen/EditorScreen"  // ← COMPONENT CHÍNH
// import ReturnDialog from "./../ReturnDialog/ReturnDialog"

// export default function CreatedCVScreen() {
//   const [screen, setScreen] = useState("myCV");
//   const [cvList, setCvList] = useState([]);
//   const [editingCV, setEditingCV] = useState(null);
//   const [pendingTemplate, setPendingTemplate] = useState(null);

//   useEffect(() => {
//     const state = loadState();
//     setCvList(state._cvList || []);
//   }, []);

//   const persistCVList = (list) => {
//     const state = loadState();
//     state._cvList = list;
//     saveState(state);
//     setCvList(list);
//   };

//   const handleTemplateSelect = (result) => {
//   // result có dạng: { templateId, _action, ... }
  
//   if (result._action === 'continue') {
//     // Tiếp tục chỉnh sửa
//     continueCV(result);
//   } 
//   else if (result._action === 'fresh') {
//     // Xóa CV cũ rồi tạo mới
//     if (result._existingId) {
//       const state = loadState();
//       delete state[result._existingId];
//       saveState(state);
//       persistCVList(cvList.filter(cv => cv.id !== result._existingId));
//     }
//     const template = TEMPLATES.find(t => t.id === result.templateId);
//     startNewCV(template);
//   }
//   else if (result._action === 'upload') {
//     // Tạo mới với data từ upload
//     const template = TEMPLATES.find(t => t.id === result.templateId);
//     const id = generateId();
//     const newCV = {
//       id,
//       templateId: template.id,
//       name: result.name || `CV ${template.name}`,
//       accent: template.accent,
//       updatedAt: "Vừa tạo",
//       data: { ...EMPTY_CV, ...result.data }
//     };
//     persistCVList([...cvList, newCV]);
//     setEditingCV(newCV);
//     setScreen("editor");
//   }
//   else {
//     // Tạo mới thông thường
//     const template = TEMPLATES.find(t => t.id === result.templateId);
//     startNewCV(template);
//   }
// };

 
//   const startNewCV = (template) => {
//     const id = generateId();
//     const newCV = {
//       id,
//       templateId: template.id,
//       name: `CV ${template.name}`,
//       accent: template.accent,
//       updatedAt: "Vừa tạo",
//       data: JSON.parse(JSON.stringify(EMPTY_CV))
//     };
//     persistCVList([...cvList, newCV]);
//     setEditingCV(newCV);
//     setPendingTemplate(null);
//     setScreen("editor");
//   };

//   const continueCV = (cv) => {
//     const state = loadState();
//     setEditingCV({
//       ...cv,
//       data: state[cv.id]?.data || JSON.parse(JSON.stringify(EMPTY_CV))
//     });
//     setPendingTemplate(null);
//     setScreen("editor");
//   };

//   return (
//     <>
//       {screen === "myCV" && (
//         <MyCVScreen
//           cvList={cvList || []}
//           onNew={() => setScreen("picker")}
//           onEdit={continueCV}
//           onDelete={(id) => {
//             persistCVList(cvList.filter(cv => cv.id !== id));
//             const state = loadState();
//             delete state[id];
//             saveState(state);
//           }}
//         />
//       )}

//       {screen === "picker" && (
//         <TemplatePickerScreen
//           onSelect={handleTemplateSelect}
//           existingCVs={cvList}
//           onBack={() => setScreen("myCV")}
//         />
//       )}


//       {/* {pendingTemplate && !editingCV && (
//         <ReturnDialog
//           template={pendingTemplate.template}
//           onContinue={() => continueCV(pendingTemplate.existing)}
//           onFresh={() => {
//             const state = loadState();
//             delete state[pendingTemplate.existing.id];
//             saveState(state);
//             continueCV({ ...pendingTemplate.existing, data: JSON.parse(JSON.stringify(EMPTY_CV)) });
//           }}
//           onCancel={() => setPendingTemplate(null)}
//         />
//       )}
//        */}


//        {pendingTemplate && (
//         <ReturnDialog
//           template={pendingTemplate.template}
//           hasExistingCV={!!pendingTemplate.existing}
//           onContinue={() => continueCV(pendingTemplate.existing)}
//           onFresh={() => {
//             // Xóa CV cũ rồi tạo mới
//             if (pendingTemplate.existing) {
//               const state = loadState();
//               delete state[pendingTemplate.existing.id];
//               saveState(state);
//               // Xóa khỏi list
//               persistCVList(cvList.filter(cv => cv.id !== pendingTemplate.existing.id));
//             }
//             startNewCV(pendingTemplate.template);
//           }}
//           onCreateNew={() => startNewCV(pendingTemplate.template)}
//           onUpload={async (files) => {
//             const formData = new FormData();
//             Array.from(files).forEach(file => formData.append('files', file));

//             try {
//               const res = await fetch('/cv-analyzer/analyze', {
//                 method: 'POST',
//                 body: formData,
//               });
//               const data = await res.json();

//               if (data.success) {
//                 const cvData = data.data[0];
//                 const id = generateId();
//                 const newCV = {
//                   id,
//                   templateId: pendingTemplate.template.id,
//                   name: cvData.name || `CV ${pendingTemplate.template.name}`,
//                   accent: pendingTemplate.template.accent,
//                   updatedAt: "Vừa tạo",
//                   data: {
//                     ...JSON.parse(JSON.stringify(EMPTY_CV)),
//                     ...cvData,
//                   },
//                 };
//                 persistCVList([...cvList, newCV]);
//                 setEditingCV(newCV);
//                 setPendingTemplate(null);
//                 setScreen("editor");
//               } else {
//                 alert('Phân tích CV thất bại');
//               }
//             } catch (err) {
//               console.error(err);
//               alert('Lỗi khi tải lên CV');
//             }
//           }}
//           onCancel={() => setPendingTemplate(null)}
//         />
//       )}

//       {screen === "editor" && editingCV && (
//         <EditorScreen
//           templateId={editingCV.templateId}
//           initialData={editingCV.data}
//           cvId={editingCV.id}
//           onBack={() => {
//             setEditingCV(null);
//             setScreen("myCV");
//           }}
//         />
//       )}

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&family=Cormorant+Garamond:wght@400;500;600&family=Syne:wght@400;700;800&family=Lato:wght@300;400;700&family=Roboto:wght@300;400;500;700&family=Montserrat:wght@300;400;500;600;700&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         body { font-family: 'DM Sans', sans-serif; background: #F2F1EE; color: #1a1a1a; }
//         button { font-family: inherit; cursor: pointer; }
//         ::-webkit-scrollbar { width: 8px; }
//         ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
//       `}</style>
//     </>
//   );
// }




// import { useState, useEffect } from "react";
// import { loadState, saveState, generateId } from "../../../utils/storage"
// import { EMPTY_CV, TEMPLATES } from "../../../utils/constants"
// import MyCVScreen from "./../MyCVScreen/MyCVScreen"
// import TemplatePickerScreen from "./../TemplatePickerScreen/TemplatePickerScreen"
// import EditorScreen from "./../EditorScreen/EditorScreen"

// export default function CreatedCVScreen({ initialScreen = "myCV" }) {
//   const [screen, setScreen] = useState(initialScreen);
//   const [cvList, setCvList] = useState([]);
//   const [editingCV, setEditingCV] = useState(null);

//   useEffect(() => {
//     const state = loadState();
//     setCvList(state._cvList || []);
//   }, []);

//   const persistCVList = (list) => {
//     const state = loadState();
//     state._cvList = list;
//     saveState(state);
//     setCvList(list);
//   };

//   // Lưu data CV vào localStorage khi đang edit
//   const saveCVData = (cvId, data) => {
//     const state = loadState();
//     state[cvId] = { data, lastEdited: new Date().toISOString() };
//     saveState(state);
//   };

//   // Xử lý khi chọn template từ TemplatePickerScreen
//   const handleTemplateSelect = (result) => {
//     const { templateId, _action, data, name } = result;
//     const template = TEMPLATES.find(t => t.id === templateId);
    
//     if (!template) return;

//     // Tìm CV đã tồn tại của template này
//     const existingCV = cvList.find(cv => cv.templateId === templateId);

//     if (_action === 'continue' && existingCV) {
//       // Tiếp tục chỉnh sửa CV cũ - load data từ localStorage
//       const state = loadState();
//       const savedData = state[existingCV.id]?.data;
//       setEditingCV({
//         ...existingCV,
//         data: savedData || existingCV.data || JSON.parse(JSON.stringify(EMPTY_CV))
//       });
//       setScreen("editor");
//     } 
//     else if (_action === 'fresh') {
//       // Tạo lại từ đầu - reset data nhưng giữ nguyên CV ID nếu đã tồn tại
//       if (existingCV) {
//         // Xóa data cũ trong localStorage
//         const state = loadState();
//         delete state[existingCV.id];
//         saveState(state);
        
//         // Cập nhật lại trong list với data trống
//         const updatedCV = {
//           ...existingCV,
//           data: JSON.parse(JSON.stringify(EMPTY_CV)),
//           updatedAt: "Vừa tạo lại"
//         };
//         const newList = cvList.map(cv => 
//           cv.id === existingCV.id ? updatedCV : cv
//         );
//         persistCVList(newList);
//         setEditingCV(updatedCV);
//       } else {
//         // Chưa có thì tạo mới
//         startNewCV(template);
//       }
//       setScreen("editor");
//     }
//     else if (_action === 'upload') {
//       // Tạo mới hoặc cập nhật CV với data từ upload
//       if (existingCV) {
//         // Cập nhật CV hiện có
//         const updatedCV = {
//           ...existingCV,
//           name: name || existingCV.name,
//           data: { ...JSON.parse(JSON.stringify(EMPTY_CV)), ...data },
//           updatedAt: "Vừa cập nhật"
//         };
//         const newList = cvList.map(cv => 
//           cv.id === existingCV.id ? updatedCV : cv
//         );
//         persistCVList(newList);
//         setEditingCV(updatedCV);
//       } else {
//         // Tạo mới nếu chưa có
//         const id = generateId();
//         const newCV = {
//           id,
//           templateId: template.id,
//           name: name || `CV ${template.name}`,
//           accent: template.accent,
//           updatedAt: "Vừa tạo",
//           data: { ...JSON.parse(JSON.stringify(EMPTY_CV)), ...data }
//         };
//         persistCVList([...cvList, newCV]);
//         setEditingCV(newCV);
//       }
//       setScreen("editor");
//     }
//     else if (_action === 'create') {
//       // Tạo mới - nhưng nếu đã tồn tại thì không tạo thêm, vào edit luôn
//       if (existingCV) {
//         const state = loadState();
//         const savedData = state[existingCV.id]?.data;
//         setEditingCV({
//           ...existingCV,
//           data: savedData || existingCV.data || JSON.parse(JSON.stringify(EMPTY_CV))
//         });
//       } else {
//         startNewCV(template);
//       }
//       setScreen("editor");
//     }
//   };

//   const startNewCV = (template) => {
//     const id = generateId();
//     const newCV = {
//       id,
//       templateId: template.id,
//       name: `CV ${template.name}`,
//       accent: template.accent,
//       updatedAt: "Vừa tạo",
//       data: JSON.parse(JSON.stringify(EMPTY_CV))
//     };
//     persistCVList([...cvList, newCV]);
//     setEditingCV(newCV);
//     return newCV;
//   };

//   // Khi click "Chỉnh sửa" từ MyCVScreen
//   const handleEditCV = (cv) => {
//     const state = loadState();
//     const savedData = state[cv.id]?.data;
//     setEditingCV({
//       ...cv,
//       data: savedData || cv.data || JSON.parse(JSON.stringify(EMPTY_CV))
//     });
//     setScreen("editor");
//   };

//   // Khi Editor lưu data
//   const handleEditorSave = (cvId, newData) => {
//     saveCVData(cvId, newData);
//     // Cập nhật updatedAt trong list
//     const newList = cvList.map(cv => 
//       cv.id === cvId 
//         ? { ...cv, updatedAt: new Date().toLocaleString('vi-VN') }
//         : cv
//     );
//     persistCVList(newList);
//   };

//   return (
//     <>
//       {screen === "myCV" && (
//         <MyCVScreen
//           cvList={cvList || []}
//           onNew={() => setScreen("picker")}
//           onEdit={handleEditCV}
//           onDelete={(id) => {
//             persistCVList(cvList.filter(cv => cv.id !== id));
//             const state = loadState();
//             delete state[id];
//             saveState(state);
//           }}
//         />
//       )}

//       {screen === "picker" && (
//         <TemplatePickerScreen
//           onSelect={handleTemplateSelect}
//           existingCVs={cvList}
//           onBack={() => setScreen("myCV")}
//         />
//       )}

//       {screen === "editor" && editingCV && (
//         <EditorScreen
//           templateId={editingCV.templateId}
//           initialData={editingCV.data}
//           cvId={editingCV.id}
//           onSave={(data) => handleEditorSave(editingCV.id, data)}
//           onBack={() => {
//             setEditingCV(null);
//             setScreen("myCV");
//           }}
//         />
//       )}

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&family=Cormorant+Garamond:wght@400;500;600&family=Syne:wght@400;700;800&family=Lato:wght@300;400;700&family=Roboto:wght@300;400;500;700&family=Montserrat:wght@300;400;500;600;700&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }
//         body { font-family: 'DM Sans', sans-serif; background: #F2F1EE; color: #1a1a1a; }
//         button { font-family: inherit; cursor: pointer; }
//         ::-webkit-scrollbar { width: 8px; }
//         ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
//       `}</style>
//     </>
//   );
// }




import { useState, useEffect } from "react";
import { loadState, saveState, generateId } from "../../../utils/storage"
import { EMPTY_CV, TEMPLATES } from "../../../utils/constants"
import MyCVScreen from "./../MyCVScreen/MyCVScreen"
import TemplatePickerScreen from "./../TemplatePickerScreen/TemplatePickerScreen"
import EditorScreen from "./../EditorScreen/EditorScreen"

const DEFAULT_SECTION_TITLES = {
  summary: "Mục tiêu nghề nghiệp",
  experiences: "Kinh nghiệm làm việc",
  education: "Học vấn",
  skills: "Kỹ năng",
  awards: "Thành tích & Giải thưởng",
  certifications: "Chứng chỉ",
  activities: "Hoạt động ngoại khóa"
};

const DEFAULT_SECTION_ORDER = ["experiences", "education", "skills", "awards", "certifications", "activities"];

export default function CreatedCVScreen({ initialScreen = "myCV" }) {
  const [screen, setScreen] = useState(initialScreen);
  const [cvList, setCvList] = useState([]);
  const [editingCV, setEditingCV] = useState(null);
  const [editingTitles, setEditingTitles] = useState(DEFAULT_SECTION_TITLES);
  const [editingOrder, setEditingOrder] = useState(DEFAULT_SECTION_ORDER);

  useEffect(() => {
    const state = loadState();
    setCvList(state._cvList || []);
  }, []);

  const persistCVList = (list) => {
    const state = loadState();
    state._cvList = list;
    saveState(state);
    setCvList(list);
  };

  // Lưu data CV vào localStorage khi đang edit
  const saveCVData = (cvId, data, titles, order) => {
    const state = loadState();
    state[cvId] = { 
      data, 
      titles: titles || DEFAULT_SECTION_TITLES,
      order: order || DEFAULT_SECTION_ORDER,
      lastEdited: new Date().toISOString() 
    };
    saveState(state);
  };

  // Xử lý khi chọn template từ TemplatePickerScreen
  const handleTemplateSelect = (result) => {
    const { templateId, _action, data, name } = result;
    const template = TEMPLATES.find(t => t.id === templateId);
    
    if (!template) return;

    const existingCV = cvList.find(cv => cv.templateId === templateId);
    const state = loadState();

    if (_action === 'continue' && existingCV) {
      // Load data, titles và order đã lưu
      const saved = state[existingCV.id] || {};
      setEditingTitles(saved.titles || DEFAULT_SECTION_TITLES);
      setEditingOrder(saved.order || DEFAULT_SECTION_ORDER);
      setEditingCV({
        ...existingCV,
        data: saved.data || existingCV.data || JSON.parse(JSON.stringify(EMPTY_CV))
      });
      setScreen("editor");
    } 
    else if (_action === 'fresh') {
      if (existingCV) {
        // Reset data nhưng giữ nguyên CV
        const updatedCV = {
          ...existingCV,
          data: JSON.parse(JSON.stringify(EMPTY_CV)),
          updatedAt: "Vừa tạo lại"
        };
        const newList = cvList.map(cv => 
          cv.id === existingCV.id ? updatedCV : cv
        );
        persistCVList(newList);
        setEditingCV(updatedCV);
      } else {
        startNewCV(template);
      }
      setEditingTitles({...DEFAULT_SECTION_TITLES});
      setEditingOrder([...DEFAULT_SECTION_ORDER]);
      setScreen("editor");
    }
    else if (_action === 'upload') {
      if (existingCV) {
        const updatedCV = {
          ...existingCV,
          name: name || existingCV.name,
          data: { ...JSON.parse(JSON.stringify(EMPTY_CV)), ...data },
          updatedAt: "Vừa cập nhật"
        };
        const newList = cvList.map(cv => 
          cv.id === existingCV.id ? updatedCV : cv
        );
        persistCVList(newList);
        setEditingCV(updatedCV);
      } else {
        const id = generateId();
        const newCV = {
          id,
          templateId: template.id,
          name: name || `CV ${template.name}`,
          accent: template.accent,
          updatedAt: "Vừa tạo",
          data: { ...JSON.parse(JSON.stringify(EMPTY_CV)), ...data }
        };
        persistCVList([...cvList, newCV]);
        setEditingCV(newCV);
      }
      setEditingTitles({...DEFAULT_SECTION_TITLES});
      setEditingOrder([...DEFAULT_SECTION_ORDER]);
      setScreen("editor");
    }
    else if (_action === 'create') {
      if (existingCV) {
        const saved = state[existingCV.id] || {};
        setEditingTitles(saved.titles || DEFAULT_SECTION_TITLES);
        setEditingOrder(saved.order || DEFAULT_SECTION_ORDER);
        setEditingCV({
          ...existingCV,
          data: saved.data || existingCV.data || JSON.parse(JSON.stringify(EMPTY_CV))
        });
      } else {
        startNewCV(template);
        setEditingTitles({...DEFAULT_SECTION_TITLES});
        setEditingOrder([...DEFAULT_SECTION_ORDER]);
      }
      setScreen("editor");
    }
  };

  const startNewCV = (template) => {
    const id = generateId();
    const newCV = {
      id,
      templateId: template.id,
      name: `CV ${template.name}`,
      accent: template.accent,
      updatedAt: "Vừa tạo",
      data: JSON.parse(JSON.stringify(EMPTY_CV))
    };
    persistCVList([...cvList, newCV]);
    setEditingCV(newCV);
    return newCV;
  };

  const handleEditCV = (cv) => {
    const state = loadState();
    const saved = state[cv.id] || {};
    setEditingTitles(saved.titles || DEFAULT_SECTION_TITLES);
    setEditingOrder(saved.order || DEFAULT_SECTION_ORDER);
    setEditingCV({
      ...cv,
      data: saved.data || cv.data || JSON.parse(JSON.stringify(EMPTY_CV))
    });
    setScreen("editor");
  };

  // Lưu khi thay đổi titles hoặc order
  const handleTitlesChange = (newTitles) => {
    setEditingTitles(newTitles);
    if (editingCV) {
      saveCVData(editingCV.id, editingCV.data, newTitles, editingOrder);
    }
  };

  const handleOrderChange = (newOrder) => {
    setEditingOrder(newOrder);
    if (editingCV) {
      saveCVData(editingCV.id, editingCV.data, editingTitles, newOrder);
    }
  };

  // Lưu data từ Editor
  const handleEditorSave = (cvId, newData) => {
    const state = loadState();
    const existing = state[cvId] || {};
    state[cvId] = { 
      ...existing,
      data: newData, 
      titles: editingTitles,
      order: editingOrder,
      lastEdited: new Date().toISOString() 
    };
    saveState(state);
    
    // Cập nhật updatedAt trong list
    const newList = cvList.map(cv => 
      cv.id === cvId 
        ? { ...cv, updatedAt: new Date().toLocaleString('vi-VN') }
        : cv
    );
    persistCVList(newList);
  };

  return (
    <>
      {screen === "myCV" && (
        <MyCVScreen
          cvList={cvList || []}
          onNew={() => setScreen("picker")}
          onEdit={handleEditCV}
          onDelete={(id) => {
            persistCVList(cvList.filter(cv => cv.id !== id));
            const state = loadState();
            delete state[id];
            saveState(state);
          }}
        />
      )}

      {screen === "picker" && (
        <TemplatePickerScreen
          onSelect={handleTemplateSelect}
          existingCVs={cvList}
          onBack={() => setScreen("myCV")}
        />
      )}

      {screen === "editor" && editingCV && (
        <EditorScreen
          templateId={editingCV.templateId}
          initialData={editingCV.data}
          cvId={editingCV.id}
          sectionTitles={editingTitles}
          setSectionTitles={handleTitlesChange}
          sectionOrder={editingOrder}
          setSectionOrder={handleOrderChange}
          onSave={handleEditorSave}
          onBack={() => {
            setEditingCV(null);
            setScreen("myCV");
          }}
        />
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Sans:wght@300;400;500;600&family=Cormorant+Garamond:wght@400;500;600&family=Syne:wght@400;700;800&family=Lato:wght@300;400;700&family=Roboto:wght@300;400;500;700&family=Montserrat:wght@300;400;500;600;700&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'DM Sans', sans-serif; background: #F2F1EE; color: #1a1a1a; }
        button { font-family: inherit; cursor: pointer; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-thumb { background: #ccc; border-radius: 4px; }
      `}</style>
    </>
  );
}