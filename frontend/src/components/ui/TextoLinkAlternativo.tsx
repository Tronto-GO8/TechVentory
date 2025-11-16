import { Link } from "react-router-dom"

interface Props {
    texto: string
    textoLink: string
    to: string
}

export default function TextoLinkAlternativo({ texto, textoLink, to }: Props) {
    return (
        <div className="text-center pt-4">
            <p className="text-sm ">
                {texto}{" "}
                <Link to={to} className="text-black hover:text-gray-600 dark:text-white dark:hover:text-gray-200 font-semibold">
                    {textoLink}
                </Link>
            </p>
        </div>
    )
}