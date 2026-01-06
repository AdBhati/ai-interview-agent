export function ScoreBadge({ score }: { score: number }) {
    const color =
        score >= 70 ? 'bg-green-50 text-green-700 border-green-200' :
            score >= 50 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                'bg-red-50 text-red-700 border-red-200';

    return (
        <div className={`px-5 py-3 rounded-lg border text-center ${color}`}>
            <div className="text-3xl font-bold">{score.toFixed(1)}%</div>
            <p className="text-xs mt-1">
                {score >= 70 ? 'Strong Match' : score >= 50 ? 'Moderate Match' : 'Weak Match'}
            </p>
        </div>
    );
}
