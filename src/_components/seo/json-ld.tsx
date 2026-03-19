interface JsonLdProps {
  scripts: object[];
}

export function JsonLd({ scripts }: JsonLdProps) {
  const schemaScripts = Object.values(scripts);

  return (
    <>
      {schemaScripts.map((Script, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(Script) }}
        />
      ))}
    </>
  );
}
