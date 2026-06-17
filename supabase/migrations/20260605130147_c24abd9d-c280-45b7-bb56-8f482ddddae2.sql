
CREATE TABLE public.wishes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  recipient_name TEXT NOT NULL,
  birthday_date DATE NOT NULL,
  message TEXT NOT NULL,
  video_url TEXT,
  views INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT ALL ON public.wishes TO service_role;

ALTER TABLE public.wishes ENABLE ROW LEVEL SECURITY;

-- No anon/authenticated policies: all access goes through server functions using the service role.
-- This keeps the admin-only data safe (only the admin-authenticated server functions can read/write,
-- plus a public-by-slug server function returning only safe fields).

CREATE INDEX wishes_slug_idx ON public.wishes (slug);
CREATE INDEX wishes_created_at_idx ON public.wishes (created_at DESC);
