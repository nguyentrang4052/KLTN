import { useEffect } from 'react';
import ClassicCV from './ClassicCV';
import ModernCV from './ModernCV';
import MinimalCV from './MinimalCV';
import ProfessionalCV from './ProfessionalCV';
import CreativeCV from './CreativeCV';
import { clearActiveField } from './../common/UnifiedToolbar/UnifiedToolbar';


const CV_COMPONENTS = {
  classic: ClassicCV,
  modern: ModernCV,
  minimal: MinimalCV,
  professional: ProfessionalCV,
  creative: CreativeCV,
};

export default function CVRenderer({
  templateId,
  data,
  onChange,
  isEdit,
  accent,
  styleConfig,
  onStyleChange,
  sectionOrder,
  setSectionOrder,
  sectionTitles,
  setSectionTitles,
  // forceReset,
  editorResetKey,
  onAIAssist
}) {
  const TemplateComponent = CV_COMPONENTS[templateId] || CV_COMPONENTS.classic;

  // Giữ toolbar hiển thị khi bôi đen, ẩn khi nhấc chuột ra ngoài và không còn selection
  useEffect(() => {
    if (!isEdit) return;

    const handleDocMouseUp = (e) => {
      // Nếu click vào toolbar thì không làm gì
      if (e.target?.closest('.selection-toolbar')) return;

      // Chờ browser cập nhật selection xong
      setTimeout(() => {
        const sel = window.getSelection();
        const hasSelection = sel && sel.rangeCount > 0 && !sel.isCollapsed;
        // Nếu vẫn còn text đang được bôi đen → giữ toolbar
        if (hasSelection) return;
        // Nếu click ra ngoài CV paper → ẩn toolbar
        const cvPaper = document.getElementById('cv-paper');
        if (cvPaper && !cvPaper.contains(e.target)) {
          clearActiveField();
        }
      }, 50);
    };

    document.addEventListener('mouseup', handleDocMouseUp);
    return () => document.removeEventListener('mouseup', handleDocMouseUp);
  }, [isEdit]);

  return (
    // Trong CVRenderer.jsx, đảm bảo truyền editorResetKey:
    <TemplateComponent
      key={`${templateId}-${editorResetKey}`}
      data={data || {}}
      onChange={onChange}
      isEdit={isEdit}
      accent={accent}
      styleConfig={styleConfig}
      onStyleChange={onStyleChange}
      sectionOrder={sectionOrder}
      setSectionOrder={setSectionOrder}
      sectionTitles={sectionTitles}
      setSectionTitles={setSectionTitles}
      // forceReset={forceReset}
      editorResetKey={editorResetKey}
      onAIAssist={onAIAssist}   
    />
  );
}