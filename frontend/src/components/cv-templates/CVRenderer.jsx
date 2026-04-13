import ClassicCV from './ClassicCV';
import ModernCV from './ModernCV';
import MinimalCV from './MinimalCV';
import ProfessionalCV from './ProfessionalCV';
import CreativeCV from './CreativeCV';

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
  sectionOrder,
  setSectionOrder,
  sectionTitles,
  setSectionTitles,
}) {
  const TemplateComponent = CV_COMPONENTS[templateId] || CV_COMPONENTS.classic;

  return (
    <TemplateComponent
      data={data}
      onChange={onChange}
      isEdit={isEdit}
      accent={accent}
      styleConfig={styleConfig}
      sectionOrder={sectionOrder}
      setSectionOrder={setSectionOrder}
      sectionTitles={sectionTitles}
      setSectionTitles={setSectionTitles}
    />
  );
}