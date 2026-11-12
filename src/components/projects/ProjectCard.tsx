import React from 'react';
import { Link } from 'react-router-dom';
import { WebProject } from '../../types';
import { ExternalLink, ArrowRight, CheckCircle2, Globe, Layers } from 'lucide-react';

interface ProjectCardProps {
  project: WebProject;
  priority?: boolean;
}

export const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  return (
    <article className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-subtle hover:shadow-card-hover transition-all duration-200 flex flex-col h-full">
      {/* Screenshot / Preview Image Container */}
      <div className="relative aspect-video sm:aspect-16/10 bg-slate-100 overflow-hidden border-b border-slate-100">
        <img
          src={project.image}
          alt={`${project.title} Preview Screenshot`}
          loading="lazy"
          className="w-full h-full object-cover object-top transition-transform duration-300 group-hover:scale-102"
        />

        {/* Status & Category overlay pill */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="px-2.5 py-1 text-[11px] font-semibold bg-white/95 backdrop-blur-xs text-slate-800 rounded-md shadow-xs border border-slate-200/60">
            {project.category}
          </span>
          {project.is_featured && (
            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-600 text-white rounded-md shadow-xs">
              Featured
            </span>
          )}
        </div>

        {/* Live Status indicator */}
        <div className="absolute top-3 right-3">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{project.status || 'Live & Active'}</span>
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2.5">
          {/* Logo + Title */}
          <div className="flex items-center gap-2.5">
            {project.logo_url && (
              <img
                src={project.logo_url}
                alt={`${project.title} logo`}
                className="w-7 h-7 object-contain rounded-md shrink-0 bg-slate-50 border border-slate-200/60 p-0.5"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            )}
            <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
              <Link to={`/projects/${project.slug}`}>
                {project.title}
              </Link>
            </h3>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {project.short_description || project.detailed_description}
          </p>

          {/* Technologies Badges */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {project.technologies.slice(0, 4).map((tech) => (
              <span
                key={tech}
                className="px-2 py-0.5 text-[11px] font-medium bg-slate-100 text-slate-700 rounded-md"
              >
                {tech}
              </span>
            ))}
            {project.technologies.length > 4 && (
              <span className="px-1.5 py-0.5 text-[10px] font-medium text-slate-500 bg-slate-50 rounded-md">
                +{project.technologies.length - 4}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-3">
          {/* View Details Link */}
          <Link
            to={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-blue-600 transition-colors"
          >
            <span>View Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {/* View Live Website Button */}
          {project.link && project.link !== '#' ? (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-blue-600 transition-colors shadow-xs"
              title={`Visit live site: ${project.link}`}
            >
              <span>View Live Website</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          ) : (
            <span className="text-xs text-slate-400 italic">Internal Web Application</span>
          )}
        </div>
      </div>
    </article>
  );
};

