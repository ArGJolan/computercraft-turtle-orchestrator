CREATE TABLE public."group" (
	uuid uuid NOT NULL,
	"name" varchar NULL,
	current_action uuid NOT NULL,
	CONSTRAINT group_un UNIQUE (uuid)
);
CREATE UNIQUE INDEX group_uuid_idx ON public."group" (uuid);

CREATE TABLE public.turtle (
	uuid uuid NOT NULL,
	group_uuid uuid NOT NULL,
	current_action uuid NULL,
	CONSTRAINT turtle_un UNIQUE (uuid),
	CONSTRAINT group_uuid FOREIGN KEY (group_uuid) REFERENCES public."group"(uuid) ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE UNIQUE INDEX turtle_uuid_idx ON public.turtle (uuid);
CREATE INDEX turtle_group_uuid_idx ON public.turtle (group_uuid);

CREATE TABLE public.newtable (
	group_uuid uuid NOT NULL,
	block varchar NOT NULL
);
CREATE INDEX newtable_group_uuid_idx ON public.newtable (group_uuid);
