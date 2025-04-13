import React from 'react';
import { 
  HeartPulse, 
  Brain, 
  Star, 
  Lightbulb,
  Activity,
  RefreshCw,
  Calendar
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { FeatureCard } from '@/components/FeatureCard';

export const FeaturesSection: React.FC = () => {
  const { t } = useLanguage();
  
  const features = [
    {
      icon: <HeartPulse className="h-6 w-6 text-purple-500" />,
      title: t('features.personalized.title'),
      description: t('features.personalized.desc'),
      dialogContent: {
        sections: [
          {
            title: t('features.personalized.detail.title1'),
            content: t('features.personalized.detail.content1')
          },
          {
            title: t('features.personalized.detail.title2'),
            content: t('features.personalized.detail.content2')
          }
        ]
      }
    },
    {
      icon: <Brain className="h-6 w-6 text-purple-500" />,
      title: t('features.mental.title'),
      description: t('features.mental.desc'),
      dialogContent: {
        sections: [
          {
            title: t('features.mental.detail.title1'),
            content: t('features.mental.detail.content1')
          },
          {
            title: t('features.mental.detail.title2'),
            content: t('features.mental.detail.content2')
          }
        ]
      }
    },
    {
      icon: <Star className="h-6 w-6 text-purple-500" />,
      title: t('features.alignment.title'),
      description: t('features.alignment.desc'),
      dialogContent: {
        sections: [
          {
            title: t('features.alignment.detail.title1'),
            content: t('features.alignment.detail.content1')
          },
          {
            title: t('features.alignment.detail.title2'),
            content: t('features.alignment.detail.content2')
          }
        ]
      }
    },
    {
      icon: <Activity className="h-6 w-6 text-purple-500" />,
      title: t('features.physical.title'),
      description: t('features.physical.desc'),
      dialogContent: {
        sections: [
          {
            title: t('features.physical.detail.title1'),
            content: t('features.physical.detail.content1')
          },
          {
            title: t('features.physical.detail.title2'),
            content: t('features.physical.detail.content2')
          }
        ]
      }
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-purple-500" />,
      title: t('features.holistic.title'),
      description: t('features.holistic.desc'),
      dialogContent: {
        sections: [
          {
            title: t('features.holistic.detail.title1'),
            content: t('features.holistic.detail.content1')
          },
          {
            title: t('features.holistic.detail.title2'),
            content: t('features.holistic.detail.content2')
          }
        ]
      }
    },
    {
      icon: <Calendar className="h-6 w-6 text-purple-500" />,
      title: t('features.daily.title'),
      description: t('features.daily.desc'),
      dialogContent: {
        sections: [
          {
            title: t('features.daily.detail.title1'),
            content: t('features.daily.detail.content1')
          },
          {
            title: t('features.daily.detail.title2'),
            content: t('features.daily.detail.content2')
          }
        ]
      }
    },
    {
      icon: <Lightbulb className="h-6 w-6 text-purple-500" />,
      title: t('features.insights.title'),
      description: t('features.insights.desc'),
      dialogContent: {
        sections: [
          {
            title: t('features.insights.detail.title1'),
            content: t('features.insights.detail.content1')
          },
          {
            title: t('features.insights.detail.title2'),
            content: t('features.insights.detail.content2')
          }
        ]
      }
    }
  ];

  return (
    <section className="relative py-16 md:py-24 bg-black">
      {/* Cosmic background effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-500 via-transparent to-transparent opacity-30"></div>
          <div className="h-full w-full bg-[url('/stars-bg.png')] bg-repeat opacity-50"></div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            {t('features.heading')}
          </h2>
          <p className="text-lg text-purple-200/70 max-w-3xl mx-auto">
            {t('features.subheading')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              dialogContent={feature.dialogContent}
            />
          ))}
        </div>
      </div>
    </section>
  );
};