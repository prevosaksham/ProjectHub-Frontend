import { FiDownload, FiFileText } from "react-icons/fi";
import type { ProjectDocument } from "./types/project.types";

interface Props {
  documents: ProjectDocument[];
  projectName?: string;
}

export default function ProjectDocumentsPanel({ documents, projectName }: Props) {
  const handleDownload = (doc: any) => {
    const link = document.createElement("a");
    link.href = "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
    const name = doc.originalName || doc.name || doc.filename || doc.file?.name || (doc.url ? String(doc.url).split('/').pop() : 'document');
    link.download = name;
    link.click();
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold">Project Documents</h3>
        {projectName && <p className="text-sm text-slate-500">{projectName}</p>}
      </div>

      {documents.length === 0 ? (
        <div className="py-8 text-center">
          <FiFileText size={36} className="mx-auto text-slate-400" />
          <p className="mt-3 text-sm text-slate-500">No documents found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div key={doc.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white shadow-sm">
                  <FiFileText size={20} className="text-blue-600" />
                </div>

                <div>
                  <p className="font-medium text-slate-800">{doc.originalName || doc.name || doc.filename || doc.file?.name || (doc.url ? String(doc.url).split('/').pop() : 'Untitled')}</p>
                  <p className="text-xs text-slate-500">{doc.size ? `${(doc.size / 1024 / 1024).toFixed(2)} MB` : 'File'}</p>
                </div>
              </div>

              <button onClick={() => handleDownload(doc)} className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
                <FiDownload /> Download
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
