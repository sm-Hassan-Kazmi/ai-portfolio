/**
 * Resume PDF Document Component
 * Generates a PDF resume matching the LaTeX format
 * Uses @react-pdf/renderer for PDF generation
 */

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Link,
  Font,
} from '@react-pdf/renderer';
import { PortfolioData, Section, ExperienceMetadata, ProjectMetadata, SkillMetadata } from '@/types';

// Register fonts (using default fonts for now)
// You can add custom fonts later if needed

// Define styles matching the LaTeX resume format
const styles = StyleSheet.create({
  page: {
    padding: '1cm 2cm',
    fontSize: 10,
    fontFamily: 'Helvetica',
    lineHeight: 1.4,
  },
  header: {
    textAlign: 'center',
    marginBottom: 10,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 6,
  },
  contactLine: {
    fontSize: 10,
    marginBottom: 3,
  },
  link: {
    color: '#004F90', // primaryColor from LaTeX
    textDecoration: 'none',
  },
  section: {
    marginTop: 12,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
    paddingBottom: 2,
    borderBottom: '1pt solid #000',
  },
  subsectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 3,
  },
  subsectionTitle: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
  },
  subsectionDate: {
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  subsectionSubtitle: {
    fontSize: 10,
    fontFamily: 'Helvetica',
    fontStyle: 'italic',
    marginBottom: 3,
  },
  bulletList: {
    marginLeft: 20,
    marginTop: 2,
  },
  bulletItem: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  bullet: {
    width: 15,
    fontSize: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
  },
  profileText: {
    fontSize: 10,
    marginTop: 3,
  },
  skillsRow: {
    flexDirection: 'row',
    marginBottom: 3,
  },
  skillLabel: {
    fontFamily: 'Helvetica-Bold',
    width: 140,
  },
  skillValue: {
    flex: 1,
  },
  twoColumnList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 20,
  },
  twoColumnItem: {
    width: '50%',
    flexDirection: 'row',
    marginBottom: 3,
  },
});

export interface ResumeDocumentProps {
  data: PortfolioData;
  personalInfo: {
    name: string;
    location: string;
    phone: string;
  };
}

export function createResumeDocument(props: ResumeDocumentProps) {
  const { data, personalInfo } = props;
  // Format date for display
  const formatDate = (date?: Date): string => {
    if (!date) return 'Present';
    return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  };

  // Group skills by category
  const groupedSkills = data.skills.reduce((acc, skill) => {
    const metadata = skill.metadata as SkillMetadata;
    const category = metadata.category || 'other';
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill.title);
    return acc;
  }, {} as Record<string, string[]>);

  return (
    <Document>
      <Page size="LETTER" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.name}>{personalInfo.name}</Text>
          <Text style={styles.contactLine}>
            {personalInfo.location} | {data.contactInfo.email} | {personalInfo.phone}
          </Text>
          <Text style={styles.contactLine}>
            {data.contactInfo.socials.linkedin && (
              <>
                LinkedIn: <Link src={data.contactInfo.socials.linkedin} style={styles.link}>
                  {data.contactInfo.socials.linkedin.replace('https://linkedin.com/in/', '')}
                </Link>
                {' | '}
              </>
            )}
            {data.contactInfo.socials.github && (
              <>
                GitHub: <Link src={data.contactInfo.socials.github} style={styles.link}>
                  {data.contactInfo.socials.github.replace('https://github.com/', '')}
                </Link>
              </>
            )}
          </Text>
        </View>

        {/* Profile Section */}
        {data.about && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Profile</Text>
            <Text style={styles.profileText}>{data.about}</Text>
          </View>
        )}

        {/* Education Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Education</Text>
          <View style={styles.subsectionHeader}>
            <Text style={styles.subsectionTitle}>
              FAST - NUCES, Karachi, Pakistan
            </Text>
            <Text style={styles.subsectionDate}>Sep 2020 -- May 2024</Text>
          </View>
          <Text style={styles.subsectionSubtitle}>
            Bachelor of Science in Computer Science
          </Text>
          <Text style={styles.profileText}>
            Relevant Coursework: Artificial Intelligence, Applied Machine Learning, Deep Learning for Perception, Design & Analysis of Algorithms, DevOps
          </Text>
        </View>

        {/* Experience Section */}
        {data.experiences.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Experience</Text>
            {data.experiences.map((exp, index) => {
              const metadata = exp.metadata as ExperienceMetadata;
              return (
                <View key={exp.id} style={{ marginBottom: index < data.experiences.length - 1 ? 8 : 0 }}>
                  <View style={styles.subsectionHeader}>
                    <Text style={styles.subsectionTitle}>
                      {exp.title} — {metadata.company}
                    </Text>
                    <Text style={styles.subsectionDate}>
                      {formatDate(exp.startDate)} -- {formatDate(exp.endDate)}
                    </Text>
                  </View>
                  {exp.description && (
                    <View style={styles.bulletList}>
                      {exp.description.split('\n').filter(line => line.trim()).map((line, i) => (
                        <View key={i} style={styles.bulletItem}>
                          <Text style={styles.bullet}>◦</Text>
                          <Text style={styles.bulletText}>{line.trim()}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Projects Section */}
        {data.projects.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Projects</Text>
            {data.projects.map((project, index) => {
              const metadata = project.metadata as ProjectMetadata;
              return (
                <View key={project.id} style={{ marginBottom: index < data.projects.length - 1 ? 8 : 0 }}>
                  <View style={styles.subsectionHeader}>
                    <Text style={styles.subsectionTitle}>
                      {project.title} ({metadata.techStack.join(', ')})
                    </Text>
                    <Text style={styles.subsectionDate}>
                      {formatDate(project.startDate)} -- {formatDate(project.endDate)}
                    </Text>
                  </View>
                  {project.description && (
                    <View style={styles.bulletList}>
                      {project.description.split('\n').filter(line => line.trim()).map((line, i) => (
                        <View key={i} style={styles.bulletItem}>
                          <Text style={styles.bullet}>◦</Text>
                          <Text style={styles.bulletText}>{line.trim()}</Text>
                        </View>
                      ))}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* Technical Skills Section */}
        {data.skills.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Technical Skills</Text>
            {groupedSkills.frontend && (
              <View style={styles.skillsRow}>
                <Text style={styles.skillLabel}>Languages:</Text>
                <Text style={styles.skillValue}>
                  {groupedSkills.frontend.join(', ')}
                </Text>
              </View>
            )}
            {groupedSkills.backend && (
              <View style={styles.skillsRow}>
                <Text style={styles.skillLabel}>Frameworks/Libraries:</Text>
                <Text style={styles.skillValue}>
                  {groupedSkills.backend.join(', ')}
                </Text>
              </View>
            )}
            {groupedSkills.tools && (
              <View style={styles.skillsRow}>
                <Text style={styles.skillLabel}>DevOps/Tools:</Text>
                <Text style={styles.skillValue}>
                  {groupedSkills.tools.join(', ')}
                </Text>
              </View>
            )}
            {groupedSkills.other && (
              <View style={styles.skillsRow}>
                <Text style={styles.skillLabel}>Cloud:</Text>
                <Text style={styles.skillValue}>
                  {groupedSkills.other.join(', ')}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Certifications/Achievements Section */}
        {(data.certifications.length > 0 || data.achievements.length > 0) && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Leadership & Extracurricular</Text>
            <View style={styles.twoColumnList}>
              {[...data.certifications, ...data.achievements].map((item) => (
                <View key={item.id} style={styles.twoColumnItem}>
                  <Text style={styles.bullet}>◦</Text>
                  <Text style={styles.bulletText}>{item.title}</Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </Page>
    </Document>
  );
}
