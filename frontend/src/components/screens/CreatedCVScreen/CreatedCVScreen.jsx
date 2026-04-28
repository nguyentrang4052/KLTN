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