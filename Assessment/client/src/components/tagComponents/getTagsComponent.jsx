import React from 'react';
import useTags from './useTags';

function GetTagsComponent() {
  const { tags, loading } = useTags();

  if (loading) return <div>Loading tags...</div>;

  return (
    <div className="mt-3">
      <h6 className="text-center">Tags</h6>
      <ul className="list-group">
        {tags.map((tag, idx) => (
          <li key={idx} className="list-group-item p-1 text-center">
            {tag.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default GetTagsComponent;
