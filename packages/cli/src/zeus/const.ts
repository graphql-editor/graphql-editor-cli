/* eslint-disable */

export const AllTypesProps: Record<string,any> = {
	RFC3339Date: `scalar.RFC3339Date` as const,
	Query:{
		checkoutData:{
			data:"CheckoutDataInput"
		},
		exchangeServiceAccountKey:{

		},
		fileServerCredentials:{

		},
		findProjects:{

		},
		findProjectsByTag:{

		},
		generateStripeBillingPortal:{

		},
		getAiRespond:{

		},
		getNamespace:{

		},
		getProject:{

		},
		getTeam:{

		},
		getUser:{

		},
		listProjects:{
			sort:"ProjectsSortInput"
		},
		myTeams:{

		},
		predictCheckout:{
			data:"PredictCheckoutInput"
		},
		stripePaymentLink:{
			data:"StripeCheckoutDataInput"
		}
	},
	MarketplaceOps:{
		addProject:{
			opts:"AddProjectInput"
		},
		removeProject:{

		}
	},
	SortOrder: "enum" as const,
	ProjectsSortInput:{
		createdAt:"SortOrder",
		name:"SortOrder",
		id:"SortOrder",
		owner:"SortOrder",
		public:"SortOrder",
		slug:"SortOrder",
		tags:"SortOrder",
		team:"SortOrder"
	},
	PredictCheckoutInput:{

	},
	AccountType: "enum" as const,
	CheckoutDataInput:{
		customer:"CustomerInput",
		vat:"VatInput"
	},
	Project:{
		members:{

		},
		sources:{

		}
	},
	StripeCheckoutDataInput:{

	},
	ChangeSubscriptionInput:{

	},
	Namespace:{
		project:{

		},
		projects:{

		}
	},
	PaymentDate: `scalar.PaymentDate` as const,
	CreateServiceAccountInput:{

	},
	AddProjectInput:{
		npmRegistryPackage:"NpmRegistryPackageInput"
	},
	Decimal: `scalar.Decimal` as const,
	TeamOps:{
		addMember:{
			role:"Role"
		},
		createProject:{

		},
		createServiceAccount:{
			input:"CreateServiceAccountInput"
		},
		createServiceAccountApiKey:{

		},
		inviteToken:{
			role:"Role"
		},
		member:{

		},
		members:{

		},
		project:{

		},
		removeServiceAccount:{

		},
		removeServiceAccountApiKey:{

		},
		removeToken:{

		}
	},
	MemberOps:{
		update:{
			role:"Role"
		}
	},
	RenameFileInput:{

	},
	Team:{
		member:{

		},
		members:{

		},
		serviceAccounts:{

		}
	},
	UpdateProject:{

	},
	NpmRegistryPackageInput:{

	},
	FileServerCredentials: `scalar.FileServerCredentials` as const,
	NewSource:{

	},
	TeamEnabledFailureStatus: "enum" as const,
	CustomerInput:{

	},
	Mutation:{
		changePassword:{

		},
		changeSubscription:{
			in:"ChangeSubscriptionInput"
		},
		consumeInviteToken:{

		},
		createTeam:{

		},
		createUser:{

		},
		deployToFaker:{

		},
		removeProject:{

		},
		sync:{

		},
		team:{

		},
		updateProject:{
			in:"UpdateProject"
		},
		updateSources:{
			sources:"NewSource"
		}
	},
	VatInput:{

	},
	Marketplace:{
		projects:{
			sort:"MarketplaceProjectsSortInput"
		}
	},
	ProjectOps:{
		addMember:{
			role:"Role"
		},
		createTemporaryFile:{

		},
		removeSources:{

		},
		renameSources:{
			files:"RenameFileInput"
		},
		update:{
			in:"UpdateProject"
		}
	},
	Role: "enum" as const,
	MarketplaceProjectsSortInput:{
		createdAt:"SortOrder",
		name:"SortOrder",
		id:"SortOrder",
		owner:"SortOrder",
		public:"SortOrder",
		slug:"SortOrder",
		tags:"SortOrder",
		team:"SortOrder"
	}
}

export const ReturnTypes: Record<string,any> = {
	RFC3339Date: `scalar.RFC3339Date` as const,
	SubscriptionConnection:{
		pageInfo:"PageInfo",
		subscriptions:"Subscription"
	},
	Query:{
		checkoutData:"String",
		emailVerified:"Boolean",
		exchangeServiceAccountKey:"String",
		fileServerCredentials:"FileServerCredentials",
		findProjects:"ProjectConnection",
		findProjectsByTag:"ProjectConnection",
		generateStripeBillingPortal:"String",
		getAiRespond:"String",
		getNamespace:"Namespace",
		getProject:"Project",
		getTeam:"Team",
		getUser:"User",
		listProjects:"ProjectConnection",
		marketplace:"Marketplace",
		myTeams:"TeamConnection",
		payments:"Payment",
		predictCheckout:"PredictCheckout",
		stripePaymentLink:"String"
	},
	MarketplaceOps:{
		addProject:"Boolean",
		removeProject:"Boolean"
	},
	ServiceAccountConnection:{
		pageInfo:"PageInfo",
		serviceAccounts:"ServiceAccount"
	},
	TeamConnection:{
		pageInfo:"PageInfo",
		teams:"Team"
	},
	Project:{
		createdAt:"RFC3339Date",
		dbConnection:"String",
		description:"String",
		enabled:"Boolean",
		endpoint:"Endpoint",
		id:"ID",
		inCloud:"Boolean",
		members:"MemberConnection",
		mocked:"Boolean",
		name:"String",
		owner:"User",
		public:"Boolean",
		slug:"String",
		sources:"FakerSourceConnection",
		tags:"String",
		team:"Team",
		updatedAt:"RFC3339Date",
		upstream:"String"
	},
	PageInfo:{
		last:"String",
		limit:"Int",
		next:"Boolean"
	},
	ProjectConnection:{
		pageInfo:"PageInfo",
		projects:"Project"
	},
	SourceUploadInfo:{
		filename:"String",
		headers:"Header",
		putUrl:"String"
	},
	Header:{
		key:"String",
		value:"String"
	},
	Namespace:{
		project:"Project",
		projects:"ProjectConnection",
		public:"Boolean",
		slug:"String"
	},
	PaymentDate: `scalar.PaymentDate` as const,
	ServiceAccount:{
		description:"String",
		keys:"ServiceAccountApiKey",
		name:"String",
		tags:"String"
	},
	InviteToken:{
		createdAt:"String",
		domain:"String",
		expiration:"String",
		name:"String",
		removed:"Boolean",
		role:"Role",
		token:"String"
	},
	Decimal: `scalar.Decimal` as const,
	TeamOps:{
		addMember:"Member",
		createProject:"Project",
		createServiceAccount:"ServiceAccount",
		createServiceAccountApiKey:"ServiceAccountApiKey",
		delete:"Boolean",
		id:"ID",
		inviteToken:"String",
		member:"MemberOps",
		members:"MemberConnection",
		name:"String",
		namespace:"Namespace",
		planID:"Int",
		project:"ProjectOps",
		removeServiceAccount:"Boolean",
		removeServiceAccountApiKey:"Boolean",
		removeToken:"String"
	},
	MemberOps:{
		delete:"Boolean",
		update:"Boolean"
	},
	FakerSource:{
		checksum:"String",
		contents:"String",
		filename:"String",
		getUrl:"String",
		updatedAt:"String"
	},
	Team:{
		enabled:"TeamEnabled",
		id:"ID",
		member:"Member",
		members:"MemberConnection",
		name:"String",
		namespace:"Namespace",
		planID:"Int",
		serviceAccounts:"ServiceAccountConnection",
		tokens:"InviteToken"
	},
	MarketplaceItemConnection:{
		pageInfo:"PageInfo",
		projects:"MarketplaceItem"
	},
	PredictCheckout:{
		price:"Float",
		trialDays:"Int"
	},
	Payment:{
		amount:"Decimal",
		currency:"String",
		date:"PaymentDate",
		receiptURL:"String",
		subscriptionID:"Int"
	},
	Member:{
		email:"String",
		role:"Role",
		serviceAccount:"Boolean",
		username:"String"
	},
	TeamEnabled:{
		enabled:"Boolean",
		status:"TeamEnabledFailureStatus"
	},
	ServiceAccountApiKey:{
		id:"String",
		key:"String",
		name:"String"
	},
	FileServerCredentials: `scalar.FileServerCredentials` as const,
	User:{
		accountType:"AccountType",
		consentGiven:"Boolean",
		consentTimestamp:"Int",
		id:"ID",
		namespace:"Namespace",
		stripeCustomerId:"ID",
		subscriptions:"SubscriptionConnection",
		username:"String"
	},
	MarketplaceItem:{
		project:"Project",
		upstream:"MarketplaceUpstream"
	},
	UserConnection:{
		pageInfo:"PageInfo",
		users:"User"
	},
	Mutation:{
		changePassword:"Boolean",
		changeSubscription:"Boolean",
		consumeInviteToken:"Boolean",
		createTeam:"TeamOps",
		createUser:"User",
		deleteAccount:"Boolean",
		deployToFaker:"Boolean",
		marketplace:"MarketplaceOps",
		removeProject:"Boolean",
		resendVerificationEmail:"Boolean",
		sync:"Boolean",
		team:"TeamOps",
		updateProject:"Boolean",
		updateSources:"SourceUploadInfo"
	},
	FakerSourceConnection:{
		pageInfo:"PageInfo",
		sources:"FakerSource"
	},
	Endpoint:{
		uri:"String"
	},
	Subscription:{
		cancelURL:"String",
		expiration:"String",
		quantity:"Int",
		seats:"UserConnection",
		status:"String",
		subscriptionID:"Int",
		subscriptionPlanID:"Int",
		updateURL:"String"
	},
	MarketplaceUpstream:{
		"...on NpmRegistryPackage":"NpmRegistryPackage"
	},
	TemporaryFile:{
		getUrl:"String",
		putUrl:"String"
	},
	Marketplace:{
		projects:"MarketplaceItemConnection"
	},
	NpmRegistryPackage:{
		package:"String",
		registry:"String"
	},
	ProjectOps:{
		addMember:"Member",
		createTemporaryFile:"TemporaryFile",
		delete:"Boolean",
		deployToFaker:"Boolean",
		removeSources:"Boolean",
		renameSources:"Boolean",
		update:"Boolean"
	},
	MemberConnection:{
		members:"Member",
		pageInfo:"PageInfo"
	}
}

export const Ops = {
query: "Query" as const,
	mutation: "Mutation" as const
}