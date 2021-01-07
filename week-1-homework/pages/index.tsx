import {useDropzone} from 'react-dropzone'
import {ChangeEvent, useCallback, useEffect, useMemo, useRef, useState} from "react";
import styled, {css} from "styled-components";
import * as nsfwjs from 'nsfwjs'
import {predictionType} from "nsfwjs";
import useSWR from 'swr'

const App = () => {
    const [previewSrc, setPreviewSrc] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [result, setResult] = useState<predictionType[]|undefined>();
    const [status, setStatus] = useState<"idle" | "loading" | "done">("idle")
    const previewRef = useRef<HTMLImageElement>()
    const {data, error} = useSWR(Boolean(imageUrl) && `/api/get-source?src=${imageUrl}`)

    const onChangeImageUrl = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        setImageUrl(event.target.value);
    }, []);

    const onDrop = useCallback(acceptedFiles => {
        const reader = new FileReader();

        reader.addEventListener("load", function () {
            setPreviewSrc(reader.result as string);
        });

        if (acceptedFiles[0]) {
            reader.readAsDataURL(acceptedFiles[0]);
        }
    }, []);

    useEffect(() => {
        if(!previewSrc) return;
        setStatus("loading");

        nsfwjs.load().then(model => model.classify(previewRef.current)).then(result => {
            setResult(result);
            setStatus("done");
        });
    }, [previewSrc])

    useEffect(() => {
        if(!data) return;

        setPreviewSrc(`data:image;base64,${data.source}`);
    }, [data])

    const nsfw = useMemo(() => {
        if(!result) return true;

        return ["Hentai", "Porn"].includes(result?.[0].className)
    }, [result]);

    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    const dropzoneChild = useMemo(() => {
        if (isDragActive) return <p>Drop the image here...</p>
        if (previewSrc) return <Preview nsfw={nsfw} src={previewSrc} ref={previewRef}/>

        return <p>Click or drop image here.</p>
    }, [isDragActive, previewSrc, nsfw]);

    return <Wrapper>
        <Intro>
            <h1> Week 1 homework</h1>
            <h2>Upload your file and I'll let you know if it's safe for work or not</h2>
            <small>It probably isn't though, why else would you be here?</small>
        </Intro>
        <Dropzone {...getRootProps()}>
            <input {...getInputProps()}/>
            {dropzoneChild}
        </Dropzone>
        <LoadImageFromUrl>
            <label>
                Or load an image url. Wouldn't want to store nsfw content on a work machine eh?<br/>
                <input type="text" onChange={onChangeImageUrl} />
            </label>
        </LoadImageFromUrl>
        <Result>
            <h2>Result</h2>
            {status === "loading" && (
                <p>Loading...</p>
            )}
            {error && (
                <p>Something went wrong while loading your image url, please make sure it links directly to an image.</p>
            )}
            {nsfw && result && (
                <p>Seems pretty NSFW. I've blurred it for you.</p>
            )}
            <ul>
                {result?.map(item => (
                    <li>{item.className}: {Math.ceil(item.probability * 100)}%</li>
                ))}
            </ul>
        </Result>
    </Wrapper>
}

const Wrapper = styled.div`
position: absolute;
left: 0;
top: 0;
right: 0;
bottom: 0;
overflow: auto;
display: grid;
grid: repeat(3, auto) / repeat(4,25%);
font-family: sans-serif;
padding: 20px 30px 20px 20px;
gap: 10px;
`

const Intro = styled.div`
grid-area: 1/2/1/3;
word-break: break-all;

@media screen and (max-width: 1000px) {
  grid-area: 1/1/1/5;
}
`

const Preview = styled.img<{nsfw?: boolean}>`
max-width: 100%;

${props => props.nsfw && css`
    filter: blur(8px);
`}
`

const Dropzone = styled.div`
grid-area: 2/2;

@media screen and (max-width: 1000px) {
  grid-area: 2/1/2/3;
}
`

const LoadImageFromUrl = styled.div`
grid-area: 2/3;

@media screen and (max-width: 1000px) {
  grid-area: 2/3/2/5;
}
`

const Result = styled.div`
grid-area: 3/2;

@media screen and (max-width: 1000px) {
  grid-area: 3/1/3/5;
}

li:first-child {
  color: red;
  font-size: 1.2em;
  padding-bottom: 5px;
}
`

export default App;
