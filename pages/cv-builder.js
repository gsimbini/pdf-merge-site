// pages/cv-builder.js
import Head from 'next/head';
import { useState } from 'react';

export default function CVBuilder() {
  const [formData, setFormData] = useState({
    fullName: 'John Doe',
    jobTitle: 'Frontend Developer',
    email: 'john.doe@example.com',
    phone: '+27 82 123 4567',
    location: 'Cape Town, South Africa',
    linkedin: 'linkedin.com/in/johndoe',
    github: 'github.com/johndoe',
    summary: 'Passionate frontend developer with 4+ years of experience building responsive web applications using React, Next.js and TypeScript.',

    experience: [
      {
        company: 'Tech Solutions',
        position: 'Senior Frontend Developer',
        dates: 'Jan 2022 – Present',
        description: '• Led development of 5+ client-facing web applications\n• Improved page load time by 40% through code splitting and lazy loading\n• Mentored 3 junior developers'
      },
      {
        company: 'Web Agency',
        position: 'Frontend Developer',
        dates: 'Jun 2020 – Dec 2021',
        description: '• Built e-commerce platforms and marketing websites\n• Implemented responsive designs across mobile, tablet and desktop\n• Integrated REST and GraphQL APIs'
      }
    ],

    education: [
      {
        school: 'University of Cape Town',
        degree: 'BSc Computer Science',
        dates: '2017 – 2019',
        description: 'Graduated with distinction'
      }
    ],

    skills: 'React, Next.js, JavaScript, TypeScript, Tailwind CSS, HTML5, CSS3, Git, Figma, Responsive Design'
  });

  const [selectedTemplate, setSelectedTemplate] = useState('modern');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleArrayChange = (index, field, value, arrayName) => {
    setFormData(prev => {
      const newArray = [...prev[arrayName]];
      newArray[index] = { ...newArray[index], [field]: value };
      return { ...prev, [arrayName]: newArray };
    });
  };

  const addEntry = (arrayName) => {
    setFormData(prev => ({
      ...prev,
      [arrayName]: [
        ...prev[arrayName],
        arrayName === 'experience'
          ? { company: '', position: '', dates: '', description: '' }
          : { school: '', degree: '', dates: '', description: '' }
      ]
    }));
  };

  const downloadPDF = () => {
    window.print();
  };

  return (
    <>
      <Head>
        <title>Free CV / Resume Builder – SimbaPDF</title>
        <meta
          name="description"
          content="Create a professional resume in minutes. Choose template, fill in your details, and download as PDF – all in your browser."
        />
      </Head>

      <div style={{
        minHeight: '100vh',
        background: '#f8f9fa',
        padding: '1rem',
        fontFamily: 'system-ui, -apple-system, sans-serif'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h1 style={{ textAlign: 'center', margin: '1.5rem 0 2rem' }}>
            Create Your Resume
          </h1>

          <div className="cv-layout">
            {/* LEFT – FORM */}
            <div className="form-panel">
              <h2 style={{ marginTop: 0 }}>Your Information</h2>

              {/* Template chooser */}
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                  Choose a template:
                </label>
                <select
                  value={selectedTemplate}
                  onChange={e => setSelectedTemplate(e.target.value)}
                  style={{ width: '100%', padding: '0.6rem', fontSize: '1rem' }}
                >
                  <option value="modern">Modern Clean</option>
                  <option value="classic">Classic Professional</option>
                  <option value="sidebar">Creative Sidebar</option>
                </select>
              </div>

              <div style={{ display: 'grid', gap: '1rem' }}>
                <input name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleChange} style={{ padding: '0.7rem', fontSize: '1.1rem' }} />
                <input name="jobTitle" placeholder="Desired Job Title" value={formData.jobTitle} onChange={handleChange} />
                <input name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
                <input name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
                <input name="location" placeholder="Location" value={formData.location} onChange={handleChange} />
                <input name="linkedin" placeholder="LinkedIn URL" value={formData.linkedin} onChange={handleChange} />
                <input name="github" placeholder="GitHub URL (optional)" value={formData.github} onChange={handleChange} />

                <textarea name="summary" placeholder="Professional Summary" value={formData.summary} onChange={handleChange} rows={4} style={{ padding: '0.7rem' }} />
              </div>

              {/* Experience */}
              <div style={{ margin: '2rem 0' }}>
                <h3>Experience</h3>
                {formData.experience.map((exp, index) => (
                  <div key={index} style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                    <input placeholder="Company Name" value={exp.company} onChange={e => handleArrayChange(index, 'company', e.target.value, 'experience')} style={{ width: '100%', marginBottom: '0.5rem' }} />
                    <input placeholder="Position" value={exp.position} onChange={e => handleArrayChange(index, 'position', e.target.value, 'experience')} />
                    <input placeholder="Dates (e.g. Jan 2022 – Present)" value={exp.dates} onChange={e => handleArrayChange(index, 'dates', e.target.value, 'experience')} />
                    <textarea placeholder="Description (use • for bullets)" value={exp.description} onChange={e => handleArrayChange(index, 'description', e.target.value, 'experience')} rows={3} style={{ width: '100%', marginTop: '0.5rem' }} />
                  </div>
                ))}
                <button onClick={() => addEntry('experience')} style={{ padding: '0.6rem 1.2rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '6px' }}>
                  + Add Experience
                </button>
              </div>

              {/* Education */}
              <div style={{ margin: '2rem 0' }}>
                <h3>Education</h3>
                {formData.education.map((edu, index) => (
                  <div key={index} style={{ marginBottom: '1.5rem', padding: '1rem', background: '#f8f9fa', borderRadius: '8px' }}>
                    <input placeholder="School / University" value={edu.school} onChange={e => handleArrayChange(index, 'school', e.target.value, 'education')} style={{ width: '100%', marginBottom: '0.5rem' }} />
                    <input placeholder="Degree" value={edu.degree} onChange={e => handleArrayChange(index, 'degree', e.target.value, 'education')} style={{ width: '100%', marginBottom: '0.5rem' }} />
                    <input placeholder="Dates (e.g. 2017 – 2020)" value={edu.dates} onChange={e => handleArrayChange(index, 'dates', e.target.value, 'education')} style={{ width: '100%', marginBottom: '0.5rem' }} />
                    <textarea placeholder="Description / Achievements" value={edu.description || ''} onChange={e => handleArrayChange(index, 'description', e.target.value, 'education')} rows={2} style={{ width: '100%', marginTop: '0.5rem' }} />
                  </div>
                ))}
                <button onClick={() => addEntry('education')} style={{ padding: '0.6rem 1.2rem', background: '#0070f3', color: 'white', border: 'none', borderRadius: '6px' }}>
                  + Add Education
                </button>
              </div>

              {/* Skills */}
              <div>
                <h3>Skills</h3>
                <textarea name="skills" placeholder="React, JavaScript, Tailwind CSS, Git..." value={formData.skills} onChange={handleChange} rows={3} style={{ width: '100%' }} />
              </div>
            </div>

            {/* RIGHT – PREVIEW */}
            <div className="preview-panel">
              <h2 style={{ textAlign: 'center', marginTop: 0 }}>Preview</h2>

              <div id="cv-preview" className="cv-preview-content">
                {selectedTemplate === 'modern' && <ModernTemplate data={formData} />}
                {selectedTemplate === 'classic' && <ClassicTemplate data={formData} />}
                {selectedTemplate === 'sidebar' && <SidebarTemplate data={formData} />}
              </div>

              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <button onClick={downloadPDF} className="download-btn">
                  Download PDF (Print → Save as PDF)
                </button>
                <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '1rem' }}>
                  Use your browser's "Save as PDF" option in the print dialog
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .cv-layout {
          display: flex;
          flex-direction: column;
          gap: 2rem;
        }

        @media (min-width: 992px) {
          .cv-layout {
            flex-direction: row;
          }
        }

        .form-panel {
          flex: 1;
          background: white;
          padding: 1.5rem;
          border-radius: 12px;
          box-shadow: 0 4px 12px rgba(0,0,0,0.08);
        }

        .preview-panel {
          flex: 1;
          background: white;
          padding: 2rem;
          border-radius: 12px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.1);
          position: sticky;
          top: 1rem;
          height: fit-content;
        }

        .cv-preview-content {
          padding: 1.5cm 1.2cm;
          background: white;
          min-height: 29.7cm;
          width: 21cm;
          margin: 0 auto;
          box-shadow: 0 0 15px rgba(0,0,0,0.15);
          font-size: 0.95rem;
          line-height: 1.5;
        }

        .download-btn {
          padding: 0.9rem 2.5rem;
          font-size: 1.1rem;
          background: #0070f3;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
        }

        @media print {
          body > *:not(#cv-preview) {
            display: none !important;
          }
          #cv-preview {
            box-shadow: none !important;
            margin: 0 !important;
            width: 100% !important;
            min-height: auto !important;
          }
          .cv-preview-content {
            width: 100%;
            box-shadow: none;
            padding: 1cm;
          }
        }
      `}</style>
    </>
  );
}

// ────────────────────────────────────────────────
// Template components (unchanged)
// ────────────────────────────────────────────────

function ModernTemplate({ data }) {
  return (
    <div style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}>
      <h1 style={{ margin: 0, fontSize: '2.2rem', color: '#1a1a1a' }}>{data.fullName || 'Your Name'}</h1>
      <p style={{ margin: '0.3rem 0 1rem', color: '#555', fontSize: '1.1rem' }}>{data.jobTitle || 'Job Title'}</p>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.2rem', fontSize: '0.95rem', marginBottom: '1.5rem' }}>
        {data.email && <span>✉ {data.email}</span>}
        {data.phone && <span>☎ {data.phone}</span>}
        {data.location && <span>📍 {data.location}</span>}
        {data.linkedin && <span>🔗 {data.linkedin}</span>}
        {data.github && <span>🐱 {data.github}</span>}
      </div>

      <hr style={{ border: 'none', borderTop: '3px solid #0070f3', margin: '1.5rem 0' }} />

      <h3 style={{ color: '#0070f3', marginBottom: '0.6rem' }}>Professional Summary</h3>
      <p style={{ whiteSpace: 'pre-wrap' }}>{data.summary || 'Write a short professional summary here...'}</p>

      <h3 style={{ color: '#0070f3', margin: '1.8rem 0 0.6rem' }}>Experience</h3>
      {data.experience.map((exp, i) => (
        <div key={i} style={{ marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold' }}>
            <span>{exp.position || 'Position'}</span>
            <span>{exp.dates || 'Dates'}</span>
          </div>
          <div style={{ color: '#444', marginBottom: '0.3rem' }}>{exp.company || 'Company'}</div>
          <div style={{ whiteSpace: 'pre-wrap' }}>{exp.description || 'Description...'}</div>
        </div>
      ))}

      <h3 style={{ color: '#0070f3', margin: '1.8rem 0 0.6rem' }}>Education</h3>
      {data.education.map((edu, i) => (
        <div key={i} style={{ marginBottom: '0.8rem' }}>
          <div style={{ fontWeight: 'bold' }}>{edu.degree || 'Degree'}</div>
          <div>{edu.school || 'School'} • {edu.dates || 'Dates'}</div>
          {edu.description && <div style={{ marginTop: '0.3rem', whiteSpace: 'pre-wrap' }}>{edu.description}</div>}
        </div>
      ))}

      <h3 style={{ color: '#0070f3', margin: '1.8rem 0 0.6rem' }}>Skills</h3>
      <p style={{ whiteSpace: 'pre-wrap' }}>{data.skills || 'List your skills...'}</p>
    </div>
  );
}

function ClassicTemplate({ data }) {
  return (
    <div style={{ fontFamily: 'Georgia, serif' }}>
      <h1 style={{ textAlign: 'center', fontSize: '2.4rem', marginBottom: '0.3rem' }}>{data.fullName || 'Your Name'}</h1>
      <p style={{ textAlign: 'center', margin: '0 0 1.5rem', fontStyle: 'italic' }}>{data.jobTitle || 'Job Title'}</p>

      <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
        {data.email} {data.phone && '•'} {data.phone} {data.location && '•'} {data.location}
        {(data.linkedin || data.github) && <br />}
        {data.linkedin} {data.github && '•'} {data.github}
      </div>

      <hr style={{ margin: '1.5rem 0' }} />

      <h3 style={{ textAlign: 'center', borderBottom: '1px solid #000', paddingBottom: '0.3rem' }}>Summary</h3>
      <p style={{ textAlign: 'center', margin: '1rem 0 2rem', whiteSpace: 'pre-wrap' }}>{data.summary || 'Summary...'}</p>

      <h3>Experience</h3>
      {data.experience.map((exp, i) => (
        <div key={i} style={{ marginBottom: '1.2rem' }}>
          <strong>{exp.position || 'Position'}</strong> – {exp.company || 'Company'}<br />
          <em>{exp.dates || 'Dates'}</em>
          <div style={{ marginTop: '0.4rem', whiteSpace: 'pre-wrap' }}>{exp.description || 'Description...'}</div>
        </div>
      ))}

      <h3>Education</h3>
      {data.education.map((edu, i) => (
        <div key={i} style={{ marginBottom: '0.8rem' }}>
          <strong>{edu.degree || 'Degree'}</strong><br />
          {edu.school || 'School'}, {edu.dates || 'Dates'}
          {edu.description && <div style={{ marginTop: '0.3rem' }}>{edu.description}</div>}
        </div>
      ))}

      <h3>Skills</h3>
      <p style={{ whiteSpace: 'pre-wrap' }}>{data.skills || 'Skills...'}</p>
    </div>
  );
}

function SidebarTemplate({ data }) {
  return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif' }}>
      {/* Left sidebar */}
      <div style={{
        width: '35%',
        background: '#1a2a44',
        color: 'white',
        padding: '1.5cm 1cm',
        minHeight: '29.7cm'
      }}>
        <h1 style={{ margin: 0, fontSize: '1.8rem' }}>{data.fullName || 'Your Name'}</h1>
        <p style={{ margin: '0.4rem 0 1.5rem', opacity: 0.9 }}>{data.jobTitle || 'Job Title'}</p>

        <h4 style={{ margin: '1.8rem 0 0.6rem', color: '#a0c4ff' }}>Contact</h4>
        {data.email && <p style={{ margin: '0.4rem 0', fontSize: '0.95rem' }}>✉ {data.email}</p>}
        {data.phone && <p style={{ margin: '0.4rem 0', fontSize: '0.95rem' }}>☎ {data.phone}</p>}
        {data.location && <p style={{ margin: '0.4rem 0', fontSize: '0.95rem' }}>📍 {data.location}</p>}
        {data.linkedin && <p style={{ margin: '0.4rem 0', fontSize: '0.95rem' }}>🔗 {data.linkedin}</p>}
        {data.github && <p style={{ margin: '0.4rem 0', fontSize: '0.95rem' }}>🐱 {data.github}</p>}

        <h4 style={{ margin: '2rem 0 0.6rem', color: '#a0c4ff' }}>Skills</h4>
        <p style={{ whiteSpace: 'pre-wrap', fontSize: '0.95rem' }}>{data.skills || 'Skills...'}</p>
      </div>

      {/* Right content */}
      <div style={{ width: '65%', padding: '1.5cm 1.2cm' }}>
        <h3 style={{ color: '#1a2a44', marginTop: 0 }}>Professional Summary</h3>
        <p style={{ whiteSpace: 'pre-wrap' }}>{data.summary || 'Summary...'}</p>

        <h3 style={{ color: '#1a2a44', margin: '1.8rem 0 0.8rem' }}>Experience</h3>
        {data.experience.map((exp, i) => (
          <div key={i} style={{ marginBottom: '1.3rem' }}>
            <div style={{ fontWeight: 'bold' }}>{exp.position || 'Position'}</div>
            <div style={{ color: '#444' }}>{exp.company || 'Company'} • {exp.dates || 'Dates'}</div>
            <div style={{ marginTop: '0.4rem', whiteSpace: 'pre-wrap' }}>{exp.description || 'Description...'}</div>
          </div>
        ))}

        <h3 style={{ color: '#1a2a44', margin: '1.8rem 0 0.8rem' }}>Education</h3>
        {data.education.map((edu, i) => (
          <div key={i} style={{ marginBottom: '0.8rem' }}>
            <strong>{edu.degree || 'Degree'}</strong><br />
            {edu.school || 'School'} • {edu.dates || 'Dates'}
            {edu.description && <div style={{ marginTop: '0.3rem' }}>{edu.description}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}