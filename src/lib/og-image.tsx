import {ImageResponse} from 'next/og';

export const OG_SIZE = {width: 1200, height: 630};

type OgImageOptions = {
  title: string;
  subtitle?: string;
  label?: string;
  imageUrl?: string | null;
};

export function renderOgImage({
  title,
  subtitle,
  label = 'IT CLUB · CCRC',
  imageUrl,
}: OgImageOptions) {
  const displayTitle =
    title.length > 72 ? `${title.slice(0, 69)}…` : title;

  return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            background: 'linear-gradient(145deg, #050A18 0%, #003d99 55%, #0052CC 100%)',
            padding: 56,
            fontFamily: 'system-ui, sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              flex: 1,
              paddingRight: imageUrl ? 40 : 0,
            }}
          >
            <div
              style={{
                fontSize: 26,
                fontWeight: 600,
                color: '#E8F0FC',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              {label}
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: 20}}>
              <div
                style={{
                  fontSize: 56,
                  fontWeight: 700,
                  color: '#ffffff',
                  lineHeight: 1.15,
                  maxWidth: imageUrl ? 720 : 1000,
                }}
              >
                {displayTitle}
              </div>
              {subtitle ? (
              <div
                style={{
                  fontSize: 28,
                  color: 'rgba(232, 240, 252, 0.92)',
                  maxWidth: 800,
                  lineHeight: 1.35,
                }}
              >
                {subtitle.length > 120 ?
                  `${subtitle.slice(0, 117)}…` :
                  subtitle}
              </div>
            ) : null}
            </div>
            <div style={{fontSize: 22, color: 'rgba(255,255,255,0.55)'}}>
            ccrcitclub2077@gmail.com
            </div>
          </div>
          {imageUrl ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imageUrl}
              alt=""
              width={280}
              height={280}
              style={{
                borderRadius: 24,
                objectFit: 'cover',
                border: '4px solid rgba(255,255,255,0.2)',
              }}
            />
          </div>
        ) : null}
        </div>
      ),
      {...OG_SIZE},
  );
}
