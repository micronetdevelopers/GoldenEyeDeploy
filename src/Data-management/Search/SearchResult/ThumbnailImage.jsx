import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

const ThumbnailImage = ({ element, airbusToken }) => {
    const [imageSrc, setImageSrc] = useState(null);

    useEffect(() => {
        const fetchImage = async () => {
            try {
                const response = await fetch(element._links?.thumbnail?.href, {
                    headers: {
                        'Authorization': `Bearer ${airbusToken}`,
                    },
                });

                if (!response.ok) throw new Error('Failed to fetch image');

                const blob = await response.blob();
                const objectURL = URL.createObjectURL(blob);
                setImageSrc(objectURL);
            } catch (error) {
                console.error("Error fetching image:", error);
                setImageSrc(null); // Optionally, set a fallback or placeholder image here
            }
        };

        fetchImage();

        // Cleanup the blob URL when the component unmounts
        return () => {
            if (imageSrc) {
                URL.revokeObjectURL(imageSrc);
            }
        };
    }, [element._links?.thumbnail?.href, airbusToken]);

    return (
        <div className="bg-black text-white relative flex items-center justify-center box-border">
            {imageSrc ? (
                <img
                    className="max-h-[128px] w-full object-contain"
                    alt="thumbnail"
                    src={imageSrc}
                />
            ) : (
                <>
                    <div className="flex flex-col items-center justify-center">
                        <FontAwesomeIcon icon={faSpinner} spin className="text-white-600 text-1xl mb-2" />
                        <div className="text-white-600 text-sm">Loading...</div>
                    </div>
                </>
            )}
        </div>
    );
};

export default ThumbnailImage;
