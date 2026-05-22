import { useState, useEffect } from "react";
import { EMPTY_CV, TEMPLATES } from "../../../utils/constants";
import MyCVScreen from "./../MyCVScreen/MyCVScreen";
import TemplatePickerScreen from "./../TemplatePickerScreen/TemplatePickerScreen";
import EditorScreen from "./../EditorScreen/EditorScreen";
import { getToken } from "../../../utils/auth";

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
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

function getTemplateAccent(id) {
  const colors = {
    classic: "#2C3E6B", modern: "#1A6B5A",
    minimal: "#1C1C1C", professional: "#8B1A1A", creative: "#5B2D8E"
  };
  return colors[id] || "#2C3E6B";
}

export default function CreatedCVScreen({ initialScreen = "myCV" }) {
  const [screen, setScreen] = useState(initialScreen);
  const [cvList, setCvList] = useState([]);
  const [editingCV, setEditingCV] = useState(null);
  const [editingTitles, setEditingTitles] = useState(DEFAULT_SECTION_TITLES);
  const [editingOrder, setEditingOrder] = useState(DEFAULT_SECTION_ORDER);

  useEffect(() => {
    loadCVList();
  }, []);

  const getAuthHeaders = () => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${getToken()}`
  });

  const loadCVList = async () => {
    try {
      const res = await fetch(`${API_BASE}/cv-builder/list`, {
        headers: getAuthHeaders()
      });
      if (!res.ok) throw new Error('Failed to fetch CV list');
      const data = await res.json();
      const list = data.map(cv => ({
        id: cv.id,
        templateId: cv.templateId,
        name: cv.name,
        accent: getTemplateAccent(cv.templateId),
        updatedAt: new Date(cv.updatedAt).toLocaleString('vi-VN'),
        data: cv.data?.cvData || EMPTY_CV
      }));
      setCvList(list);
    } catch (err) {
      console.error("loadCVList error:", err);
    }
  };

  const createCV = async (name, templateId, cvData) => {
    const res = await fetch(`${API_BASE}/cv-builder/create`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, templateId, data: cvData })
    });
    if (!res.ok) throw new Error('Create failed');
    return res.json();
  };

  const updateCV = async (id, name, cvData) => {
    const res = await fetch(`${API_BASE}/cv-builder/update/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ name, data: cvData })
    });
    if (!res.ok) throw new Error('Update failed');
    return res.json();
  };

  const deleteCV = async (id) => {
    const res = await fetch(`${API_BASE}/cv-builder/delete/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Delete failed');
  };

  const getCVDetail = async (id) => {
    const res = await fetch(`${API_BASE}/cv-builder/detail/${id}`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Detail failed');
    return res.json();
  };

  const startNewCV = async (template) => {
    const newCv = await createCV(`CV ${template.name}`, template.id, {
      cvData: JSON.parse(JSON.stringify(EMPTY_CV)),
      sectionTitles: DEFAULT_SECTION_TITLES,
      sectionOrder: DEFAULT_SECTION_ORDER,
      styleConfig: { accentColor: template.accent }
    });
    await loadCVList();
    return {
      id: newCv.id,
      templateId: newCv.templateId,
      name: newCv.name,
      accent: template.accent,
      updatedAt: "Vừa tạo",
      data: EMPTY_CV
    };
  };

  const handleTemplateSelect = async (result) => {
    const { templateId, _action, data, name } = result;
    const template = TEMPLATES.find(t => t.id === templateId);
    if (!template) return;

    const existingCV = cvList.find(cv => cv.templateId === templateId);

    if (_action === 'continue' && existingCV) {
      const full = await getCVDetail(existingCV.id);
      setEditingTitles(full.data?.sectionTitles || DEFAULT_SECTION_TITLES);
      setEditingOrder(full.data?.sectionOrder || DEFAULT_SECTION_ORDER);
      setEditingCV({
        ...existingCV,
        data: full.data?.cvData || existingCV.data
      });
      setScreen("editor");
    }
    else if (_action === 'fresh') {
      if (existingCV) {
        await deleteCV(existingCV.id);
      }
      const newCv = await startNewCV(template);
      setEditingCV(newCv);
      setEditingTitles({ ...DEFAULT_SECTION_TITLES });
      setEditingOrder([...DEFAULT_SECTION_ORDER]);
      setScreen("editor");
    }
    else if (_action === 'upload') {
      const mergedData = { ...JSON.parse(JSON.stringify(EMPTY_CV)), ...data };
      const payload = {
        cvData: mergedData,
        sectionTitles: DEFAULT_SECTION_TITLES,
        sectionOrder: DEFAULT_SECTION_ORDER,
        styleConfig: { accentColor: template.accent }
      };
      if (existingCV) {
        await updateCV(existingCV.id, name || existingCV.name, payload);
        await loadCVList();
        const full = await getCVDetail(existingCV.id);
        setEditingCV({
          ...existingCV,
          name: full.name,
          data: full.data?.cvData
        });
      } else {
        const newCv = await createCV(name || `CV ${template.name}`, template.id, payload);
        await loadCVList();
        setEditingCV({
          id: newCv.id,
          templateId: newCv.templateId,
          name: newCv.name,
          accent: template.accent,
          updatedAt: "Vừa tạo",
          data: newCv.data?.cvData || mergedData
        });
      }
      setEditingTitles({ ...DEFAULT_SECTION_TITLES });
      setEditingOrder([...DEFAULT_SECTION_ORDER]);
      setScreen("editor");
    }
    else if (_action === 'create') {
      if (existingCV) {
        const full = await getCVDetail(existingCV.id);
        setEditingTitles(full.data?.sectionTitles || DEFAULT_SECTION_TITLES);
        setEditingOrder(full.data?.sectionOrder || DEFAULT_SECTION_ORDER);
        setEditingCV({
          ...existingCV,
          data: full.data?.cvData || existingCV.data
        });
      } else {
        const newCv = await startNewCV(template);
        setEditingCV(newCv);
      }
      setScreen("editor");
    }
  };

  const handleEditCV = async (cv) => {
    const full = await getCVDetail(cv.id);
    setEditingTitles(full.data?.sectionTitles || DEFAULT_SECTION_TITLES);
    setEditingOrder(full.data?.sectionOrder || DEFAULT_SECTION_ORDER);
    setEditingCV({
      ...cv,
      data: full.data?.cvData || cv.data
    });
    setScreen("editor");
  };

  const handleDeleteCV = async (id) => {
    await deleteCV(id);
    await loadCVList();
  };

  const handleEditorSave = async (cvId, newData, titles, order, styleConfig, cvName) => {
    await updateCV(cvId, cvName, {
      cvData: newData,
      sectionTitles: titles,
      sectionOrder: order,
      styleConfig
    });
    await loadCVList();
  };

  const handleTitlesChange = (newTitles) => {
    setEditingTitles(newTitles);
    if (editingCV) {
      handleEditorSave(editingCV.id, editingCV.data, newTitles, editingOrder, editingCV.styleConfig, editingCV.name);
    }
  };

  const handleOrderChange = (newOrder) => {
    setEditingOrder(newOrder);
    if (editingCV) {
      handleEditorSave(editingCV.id, editingCV.data, editingTitles, newOrder, editingCV.styleConfig, editingCV.name);
    }
  };

  return (
    <>
      {screen === "myCV" && (
        <MyCVScreen
          cvList={cvList}
          onNew={() => setScreen("picker")}
          onEdit={handleEditCV}
          onDelete={handleDeleteCV}
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
          key={editingCV.id}
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